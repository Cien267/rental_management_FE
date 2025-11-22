<template>
  <Modal
    v-model:show="isShow"
    :title="isEdit ? 'Chỉnh sửa hợp đồng' : 'Tạo hợp đồng mới'"
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
              >Phòng <span class="text-red-500">*</span></label
            >
            <Select
              v-model="formData.roomId"
              :options="roomOptions"
              option-label="name"
              option-value="id"
              class="w-full"
              :class="{ 'border-red-500': errors.roomId }"
              placeholder="Chọn phòng"
            />
            <p v-if="errors.roomId" class="text-sm text-red-500">{{ errors.roomId }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Người đại diện <span class="text-red-500">*</span></label
            >
            <Select
              v-model="formData.tenantId"
              :options="tenantOptions"
              option-label="fullName"
              option-value="id"
              class="w-full"
              :disabled="!formData.roomId"
              :class="{ 'border-red-500': errors.tenantId }"
              placeholder="Chọn người đại diện"
            />
            <p v-if="errors.tenantId" class="text-sm text-red-500">{{ errors.tenantId }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Ngày bắt đầu <span class="text-red-500">*</span></label
            >
            <DatePicker
              v-model="formData.startDate as Date"
              dateFormat="dd/mm/yy"
              placeholder="Chọn ngày bắt đầu"
              class="w-full"
            />
            <p v-if="errors.startDate" class="text-sm text-red-500">{{ errors.startDate }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Ngày kết thúc <span class="text-red-500">*</span></label
            >
            <DatePicker
              v-model="formData.endDate as Date"
              dateFormat="dd/mm/yy"
              placeholder="Chọn ngày kết thúc"
              class="w-full"
            />
            <p v-if="errors.endDate" class="text-sm text-red-500">{{ errors.endDate }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Tiền cọc <span class="text-red-500">*</span></label
            >
            <InputNumber
              v-model="formData.depositAmount"
              :min="0"
              class="w-full"
              :class="{ 'border-red-500': errors.depositAmount }"
            />
            <p v-if="errors.depositAmount" class="text-sm text-red-500">
              {{ errors.depositAmount }}
            </p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Trạng thái </label>
            <Select
              v-model="formData.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              placeholder="Trạng thái"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Kì thanh toán</label>
            <Select
              v-model="formData.paymentCycle"
              :options="paymentCycleOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              placeholder="Kì thanh toán"
            />
          </div>
        </div>
      </div>
    </template>
    <template #footer="{ close }">
      <div class="flex justify-end p-4 border-t border-gray-200 gap-3">
        <Button label="Hủy" severity="secondary" @click="close" />
        <Button
          :label="isEdit ? 'Cập nhật' : 'Tạo hợp đồng'"
          :loading="loading"
          @click="handleSubmit"
        />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Modal from '@/components/base/molecules/Modal.vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import type { Contract, CreateContractInput, UpdateContractInput } from '@/types/contract'
import { createContract, updateContract } from '@/services/api/contractService'
import { useCustomToast } from '@/composables/base/useCustomToast'
import type { Room } from '@/types/room'
import { CONTRACT_STATUSES, CONTRACT_PAYMENT_CYCLES } from '@/constants/contracts'

const { tError } = useCustomToast()

interface Props {
  propertyId: number
  contract?: Contract | null
  rooms: Room[]
}

const props = withDefaults(defineProps<Props>(), {
  propertyId: 0,
  contract: null,
  rooms: () => [],
})

const emit = defineEmits<{ 'contract-saved': []; 'contract-updated': [] }>()

const isShow = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const isEdit = computed(() => !!props.contract)

const roomOptions = computed(() => props.rooms)
const tenantOptions = computed(() => {
  const roomId = formData.value.roomId
  return typeof roomId === 'number'
    ? props.rooms.find((room) => room.id === roomId)?.tenants || []
    : []
})
const statusOptions = Object.entries(CONTRACT_STATUSES).map(([value, label]) => ({
  label,
  value,
}))
const paymentCycleOptions = Object.entries(CONTRACT_PAYMENT_CYCLES).map(([value, label]) => ({
  label,
  value,
}))

const formData = ref<CreateContractInput | UpdateContractInput>({
  roomId: undefined as unknown as number,
  tenantId: undefined as unknown as number,
  startDate: '',
  endDate: '',
  depositAmount: 0,
  status: 'active',
  paymentCycle: 'monthly',
})

const resetFormData = () => {
  formData.value = {
    roomId: undefined as unknown as number,
    tenantId: undefined as unknown as number,
    startDate: '',
    endDate: '',
    depositAmount: 0,
    status: 'active',
    paymentCycle: 'monthly',
  }
}

watch(
  () => props.contract,
  (contract) => {
    if (contract) {
      formData.value = {
        id: contract.id,
        roomId: contract.roomId,
        tenantId: contract.tenantId,
        startDate: contract.startDate,
        endDate: contract.endDate ?? '',
        depositAmount: contract.depositAmount ?? 0,
        status: contract.status ?? 'active',
        paymentCycle: contract.paymentCycle ?? 'monthly',
      }
    } else {
      resetFormData()
    }
    errors.value = {}
  },
  { immediate: true },
)

watch(
  () => formData.value.roomId,
  (newRoomId, oldRoomId) => {
    if (!isEdit.value || (isEdit.value && oldRoomId !== undefined && newRoomId !== oldRoomId)) {
      formData.value.tenantId = undefined
    }
  },
)

function validateForm(): boolean {
  errors.value = {}
  if (!formData.value.roomId) errors.value.roomId = 'Vui lòng chọn phòng'
  if (!formData.value.tenantId) errors.value.tenantId = 'Vui lòng chọn người đại diện'
  if (!formData.value.startDate) errors.value.startDate = 'Vui lòng chọn ngày bắt đầu'
  if (!formData.value.endDate) errors.value.endDate = 'Vui lòng chọn ngày kết thúc'
  if (!formData.value.depositAmount) errors.value.depositAmount = 'Vui lòng nhập tiền cọc'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  loading.value = true
  try {
    const payload: any = { ...formData.value }
    payload.startDate = formData.value.startDate
      ? new Date(formData.value.startDate).toISOString().split('T')[0]
      : null
    payload.endDate = formData.value.endDate
      ? new Date(formData.value.endDate).toISOString().split('T')[0]
      : null
    if (isEdit.value) {
      await updateContract((formData.value as UpdateContractInput).id!, payload, props.propertyId)
      emit('contract-updated')
    } else {
      await createContract(payload as CreateContractInput, props.propertyId)
      emit('contract-saved')
    }
    isShow.value = false
    resetFormData()
  } catch (e: any) {
    console.error('Save contract error:', e)
    const eMsg = e?.response?.data?.message ?? 'Lỗi khi lưu hợp đồng'
    tError('Lỗi', eMsg)
  } finally {
    loading.value = false
  }
}

function handleClose() {
  isShow.value = false
  errors.value = {}
  resetFormData()
}

defineExpose({
  open: () => (isShow.value = true),
  close: () => (isShow.value = false),
})
</script>

<style scoped></style>
