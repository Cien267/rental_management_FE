<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { formatCurrency, formatDate } from '@/helpers/utils'
import { getInvoiceStatusValue, getInvoiceStatusSeverity } from '@/transformers/invoices'
import { INVOICE_STATUSES } from '@/constants/invoices'
import type { Invoice } from '@/types/invoice'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Menu from 'primevue/menu'
import { updateInvoice } from '@/services/api/invoiceService'
import { useCustomToast } from '@/composables/base/useCustomToast'
import type { Room } from '@/types/room'

const { tSuccess, tError } = useCustomToast()

const { invoices, totalRecords, loading, first, rows, rooms, propertyId } = defineProps<{
  invoices: Invoice[]
  rooms: Room[]
  totalRecords: number
  loading: boolean
  first: number
  rows: number
  sortOrder: number | undefined
  sortField: string
  propertyId: number
}>()
const emit = defineEmits([
  'edit-invoice',
  'delete-invoice',
  'open-drawer',
  'load-invoices',
  'filter',
  'sort',
])
const onPage = (event: any) => {
  emit('load-invoices', event)
}

const getRoomName = (roomId: number) => {
  return rooms?.find((room: Room) => room.id === roomId)?.name || ''
}

const statuses = ref(
  Object.entries(INVOICE_STATUSES).map(([value, label]) => ({
    label: label,
    command: async () => {
      try {
        await updateInvoice(targetInvoice.value?.id || 0, { status: value }, propertyId)
        emit('load-invoices')
        tSuccess('Thành công', 'Cập nhật trạng thái hóa đơn thành công')
      } catch (e) {
        console.error(e)
        tError('Lỗi', 'Cập nhật trạng thái hóa đơn thất bại')
      }
    },
  })),
)

const menu = ref()
const targetInvoice = ref<Invoice | null>(null)
const toggle = (event: any, invoice: Invoice) => {
  menu.value.toggle(event)
  targetInvoice.value = invoice
}

const renderPDF = (invoice: Invoice) => {
  console.log(invoice)
}
</script>

<template>
  <DataTable
    stripedRows
    paginator
    dataKey="id"
    :rows="rows"
    :rowsPerPageOptions="[5, 10, 15, 20, 50]"
    :value="invoices"
    :loading="loading"
    selectionMode="single"
    :metaKeySelection="false"
    :lazy="true"
    :first="first"
    :totalRecords="totalRecords"
    scrollable
    scrollHeight="400px"
    @rowSelect="emit('open-drawer', $event.data)"
    @page="onPage"
  >
    <template #empty> Chưa có hóa đơn nào </template>
    <template #loading> Đang tải dữ liệu </template>
    <Column field="" header="Phòng">
      <template #body="{ data }">
        {{ getRoomName(data.roomId) }}
      </template>
    </Column>
    <Column field="" header="Thời gian">
      <template #body="{ data }">
        <div class="text-base font-bold text-gray-600">Tháng {{ data.month }}/{{ data.year }}</div>
        <div class="text-sm text-gray-300">
          Từ <span class="font-semibold">{{ formatDate(data.periodStart, 'DD/MM/YYYY') }}</span> đến
          <span class="font-semibold">{{ formatDate(data.periodEnd, 'DD/MM/YYYY') }}</span>
        </div>
      </template>
    </Column>
    <Column field="totalAmount" header="Tổng tiền">
      <template #body="{ data }">
        {{ formatCurrency(data.totalAmount) }}
      </template>
    </Column>
    <Column field="totalAmount" header="Trạng thái">
      <template #body="{ data }">
        <Tag
          :value="getInvoiceStatusValue(data.status)"
          :severity="getInvoiceStatusSeverity(data.status)"
        />
      </template>
    </Column>
    <Column field="" header="Hành động">
      <template #body="slotProps">
        <Button
          aria-label="Xuất PDF"
          severity="info"
          size="small"
          icon="pi pi-file-export"
          @click="renderPDF(slotProps.data)"
          class="mr-2"
        />
        <Button
          severity="secondary"
          size="small"
          icon="pi pi-ellipsis-v"
          @click="toggle($event, slotProps.data)"
          class="mr-2"
        />
        <Menu ref="menu" id="overlay_menu" :model="statuses" :popup="true" />
        <Button
          label="Xóa"
          size="small"
          severity="danger"
          @click.stop="emit('delete-invoice', slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>
</template>
