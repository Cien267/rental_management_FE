<template>
  <Modal
    v-model:show="isShow"
    :title="isEdit ? 'Chỉnh sửa chi phí' : 'Thêm chi phí mới'"
    :enable-backdrop-close="true"
    :enable-escape-close="true"
    @submit="handleSubmit"
    @close="handleClose"
  >
    <template #body>
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Tên <span class="text-red-500">*</span></label
            >
            <InputText
              v-model="formData.name"
              placeholder="Nhập tên chi phí"
              class="w-full"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Giá (VNĐ) <span class="text-red-500">*</span></label
            >
            <InputNumber
              v-model="formData.amount"
              :min="0"
              :step="10000"
              class="w-full"
              :class="{ 'border-red-500': errors.amount }"
            />
            <p v-if="errors.amount" class="text-sm text-red-500">{{ errors.amount }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Kiểu thu phí</label>
            <Select
              v-model="formData.chargeType"
              :options="chargeTypeOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Trạng thái</label>
            <div>
              <ToggleSwitch v-model="formData.isActive" />
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Ghi chú</label>
          <Textarea v-model="formData.description" rows="3" class="w-full" />
        </div>
      </div>
    </template>
    <template #footer="{ close }">
      <div class="flex justify-end p-4 border-t border-gray-200 gap-3">
        <Button label="Hủy" severity="secondary" @click="close" />
        <Button :label="isEdit ? 'Cập nhật' : 'Tạo mới'" :loading="loading" @click="handleSubmit" />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Modal from '@/components/base/molecules/Modal.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import ToggleSwitch from 'primevue/toggleswitch'
import type { ExtraFee, CreateExtraFeeInput, UpdateExtraFeeInput } from '@/types/extraFee'
import { ChargeTypeEnum } from '@/types/extraFee'
import { createExtraFee, updateExtraFee } from '@/services/api/extraFeeService'
import { useCustomToast } from '@/composables/base/useCustomToast'
import { CHARGE_TYPES } from '@/constants/extraFees'

const { tError } = useCustomToast()

interface Props {
  propertyId: number
  extraFee?: ExtraFee | null
}

const props = withDefaults(defineProps<Props>(), {
  extraFee: null,
})

const emit = defineEmits<{ 'extra-fee-saved': []; 'extra-fee-updated': [] }>()

const isShow = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const isEdit = computed(() => !!props.extraFee)

const chargeTypeOptions = Object.entries(CHARGE_TYPES).map(([value, label]) => ({ label, value }))

const formData = ref<CreateExtraFeeInput | UpdateExtraFeeInput>({
  propertyId: props.propertyId,
  name: '',
  amount: 0,
  chargeType: ChargeTypeEnum.Enum.monthly,
  isActive: true,
  description: '',
})

const resetFormData = () => {
  formData.value = {
    propertyId: props.propertyId,
    name: '',
    amount: 0,
    chargeType: ChargeTypeEnum.Enum.monthly,
    isActive: true,
    description: '',
  }
}

watch(
  () => props.extraFee,
  (extraFee) => {
    if (extraFee) {
      formData.value = { ...extraFee, id: extraFee.id }
    } else {
      resetFormData()
    }
    errors.value = {}
  },
  { immediate: true },
)

function validateForm(): boolean {
  errors.value = {}
  if (!formData.value.name?.trim()) errors.value.name = 'Tên chi phí không được để trống'
  if (!formData.value.amount) errors.value.amount = 'Giá chi phí không được để trống'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  loading.value = true
  try {
    const payload: any = { ...formData.value }
    if (isEdit.value) {
      await updateExtraFee((formData.value as UpdateExtraFeeInput).id!, payload, props.propertyId)
      emit('extra-fee-updated')
    } else {
      await createExtraFee(payload as CreateExtraFeeInput, props.propertyId)
      emit('extra-fee-saved')
    }
    isShow.value = false
    resetFormData()
  } catch (e: any) {
    console.error('Save extraFee error:', e)
    const eMsg = e?.response?.data?.message ?? 'Lỗi khi lưu chi phí'
    tError('Lỗi', eMsg)
  } finally {
    loading.value = false
  }
}

function handleClose() {
  isShow.value = false
  errors.value = {}
}

defineExpose({
  open: () => (isShow.value = true),
  close: () => (isShow.value = false),
})
</script>

<style scoped></style>
