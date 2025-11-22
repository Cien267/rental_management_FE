<template>
  <Modal
    v-model:show="isShow"
    title="Tạo hóa đơn"
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
              placeholder="Chọn phòng"
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Tháng thuê</label>
            <DatePicker
              view="month"
              dateFormat="mm/yy"
              v-model="formData.date as Date"
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Thời gian bắt đầu</label>
            <DatePicker
              v-model="formData.periodStart as Date"
              dateFormat="dd/mm/yy"
              placeholder="Chọn ngày bắt đầu"
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Thời gian kết thúc</label>
            <DatePicker
              v-model="formData.periodEnd as Date"
              dateFormat="dd/mm/yy"
              placeholder="Chọn ngày kết thúc"
              class="w-full"
            />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Ghi chú</label>
          <Textarea
            v-model="formData.notes"
            placeholder="Nhập ghi chú (tùy chọn)"
            rows="3"
            class="w-full"
          />
        </div>
      </div>
    </template>
    <template #footer="{ close }">
      <div class="flex justify-end p-4 border-t border-gray-200 gap-3">
        <Button label="Hủy" severity="secondary" @click="close" />
        <Button label="Tạo mới" :loading="loading" @click="handleSubmit" />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Modal from '@/components/base/molecules/Modal.vue'
import Button from 'primevue/button'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import type { CreateInvoiceInput } from '@/types/invoice'
import { createInvoice } from '@/services/api/invoiceService'
import { useCustomToast } from '@/composables/base/useCustomToast'
import type { Contract } from '@/types/contract'
import type { Room } from '@/types/room'
import Textarea from 'primevue/textarea'

const { tError } = useCustomToast()

interface Props {
  propertyId: number
  contracts?: Contract[] | null
  rooms?: Room[] | null
}

const props = withDefaults(defineProps<Props>(), {
  propertyId: 0,
  contracts: null,
})

const emit = defineEmits(['invoice-saved'])

const roomOptions = computed(() => props.rooms || [])

const isShow = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const formData = ref<any>({
  propertyId: props.propertyId,
  roomId: 0,
  date: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
  periodStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
  periodEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
  notes: '',
})

const resetFormData = () => {
  formData.value = {
    propertyId: props.propertyId,
    roomId: 0,
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    periodStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    periodEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    notes: '',
  }
}

function validateForm(): boolean {
  errors.value = {}
  if (!formData.value.date) errors.value.date = 'Tháng không được để trống'
  return Object.keys(errors.value).length === 0
}

watch(
  () => formData.value.date,
  (newDate) => {
    if (!newDate) return
    const d = new Date(newDate)
    if (isNaN(d.getTime())) return
    const year = d.getFullYear()
    const month = d.getMonth()
    formData.value.periodStart = new Date(year, month, 1)
    formData.value.periodEnd = new Date(year, month + 1, 0)
  },
  { immediate: true },
)

async function handleSubmit() {
  if (!validateForm()) return
  loading.value = true
  try {
    const payload: any = { ...formData.value }
    payload.periodStart = formData.value.periodStart
      ? new Date(formData.value.periodStart).toISOString().split('T')[0]
      : null
    payload.periodEnd = formData.value.periodEnd
      ? new Date(formData.value.periodEnd).toISOString().split('T')[0]
      : null
    payload.month = formData.value.date.getMonth() + 1
    payload.year = formData.value.date.getFullYear()
    delete payload.date
    delete payload.propertyId
    let hasError = false
    const response = await createInvoice(payload as CreateInvoiceInput, props.propertyId)
    if (Array.isArray(response) && response.length > 0) {
      const errorMessage: string[] = []
      response.forEach((item) => {
        if (!item.id && item.reason) errorMessage.push(item.reason)
      })
      if (errorMessage.length > 0) {
        tError('Lỗi', errorMessage.join('. '))
        hasError = true
      }
    }
    emit('invoice-saved', hasError)
    isShow.value = false
    resetFormData()
  } catch (e: any) {
    console.error('Save invoice error:', e)
    const eMsg = e?.response?.data?.message ?? 'Lỗi khi tạo hóa đơn'
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
