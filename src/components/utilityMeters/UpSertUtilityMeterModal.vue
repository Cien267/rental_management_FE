<template>
  <Modal
    v-model:show="isShow"
    :title="isEdit ? 'Chỉnh sửa công tơ' : 'Thêm công tơ mới'"
    :enable-backdrop-close="true"
    :enable-escape-close="true"
    @submit="handleSubmit"
    @close="handleClose"
  >
    <template #body>
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Loại</label>
            <Select
              v-model="formData.meterType"
              :options="meterTypeOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              :class="{ 'border-red-500': errors.meterType }"
            />
            <p v-if="errors.meterType" class="text-sm text-red-500">{{ errors.meterType }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Đơn vị <span class="text-red-500">*</span></label
            >
            <InputText
              v-model="formData.unit"
              placeholder="kWh, m3,..."
              class="w-full"
              :class="{ 'border-red-500': errors.unit }"
            />
            <p v-if="errors.unit" class="text-sm text-red-500">{{ errors.unit }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Trạng thái</label>
            <div>
              <ToggleSwitch v-model="formData.active" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Áp dụng cho tất cả các phòng</label>
            <div>
              <ToggleSwitch v-model="formData.applyAll" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Phòng <span v-if="!formData.applyAll" class="text-red-500">*</span></label
            >
            <Select
              v-model="formData.roomId"
              :options="roomOptions"
              option-label="name"
              option-value="id"
              class="w-full"
              :disabled="formData.applyAll"
              :class="{ 'border-red-500': errors.roomId }"
              placeholder="Chọn phòng"
            />
            <p v-if="errors.roomId" class="text-sm text-red-500">{{ errors.roomId }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Ghi chú</label>
          <Textarea v-model="formData.notes" rows="3" class="w-full" />
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
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import ToggleSwitch from 'primevue/toggleswitch'
import type {
  UtilityMeter,
  CreateUtilityMeterInput,
  UpdateUtilityMeterInput,
} from '@/types/utilityMeter'
import { createUtilityMeter, updateUtilityMeter } from '@/services/api/utilityMeterService'
import { useCustomToast } from '@/composables/base/useCustomToast'
import { UTILITY_METER_TYPES } from '@/constants/utilityMeters'
import type { Room } from '@/types/room'
import { MeterTypeEnum } from '@/types/utilityMeter'

const { tError } = useCustomToast()

interface Props {
  propertyId: number
  rooms: Room[]
  utilityMeter?: UtilityMeter | null
}

const props = withDefaults(defineProps<Props>(), {
  utilityMeter: null,
})

const emit = defineEmits<{ 'utility-meter-saved': []; 'utility-meter-updated': [] }>()

const isShow = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const isEdit = computed(() => !!props.utilityMeter)

const meterTypeOptions = Object.entries(UTILITY_METER_TYPES).map(([value, label]) => ({
  label,
  value,
}))
const roomOptions = computed(() => props.rooms)

const formData = ref<CreateUtilityMeterInput | UpdateUtilityMeterInput>({
  propertyId: props.propertyId,
  meterType: MeterTypeEnum.Enum.electricity,
  roomId: null,
  active: true,
  unit: '',
  notes: '',
  applyAll: true,
})

const resetFormData = () => {
  formData.value = {
    propertyId: props.propertyId,
    meterType: MeterTypeEnum.Enum.electricity,
    roomId: null,
    active: true,
    unit: '',
    notes: '',
    applyAll: true,
  }
}

watch(
  () => props.utilityMeter,
  (utilityMeter) => {
    if (utilityMeter) {
      formData.value = { ...utilityMeter, id: utilityMeter.id }
    } else {
      resetFormData()
    }
    errors.value = {}
  },
  { immediate: true },
)

function validateForm(): boolean {
  errors.value = {}
  if (!formData.value.meterType) errors.value.meterType = 'Loại không được để trống'
  if (!formData.value.unit) errors.value.unit = 'Đơn vị không được để trống'
  if (!formData.value.applyAll && !formData.value.roomId)
    errors.value.roomId = 'Phòng không được để trống'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  loading.value = true
  try {
    const payload: any = { ...formData.value }
    if (isEdit.value) {
      await updateUtilityMeter(
        (formData.value as UpdateUtilityMeterInput).id!,
        payload,
        props.propertyId,
      )
      emit('utility-meter-updated')
    } else {
      await createUtilityMeter(payload as CreateUtilityMeterInput, props.propertyId)
      emit('utility-meter-saved')
    }
    isShow.value = false
    resetFormData()
  } catch (e: any) {
    console.error('Save utilityMeter error:', e)
    const eMsg = e?.response?.data?.message ?? 'Lỗi khi lưu công tơ'
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
