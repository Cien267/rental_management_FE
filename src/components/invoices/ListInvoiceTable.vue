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
import type { Contract } from '@/types/contract'
import SpeedDial from 'primevue/speeddial'

const { invoices, totalRecords, loading, first, rows, contracts } = defineProps<{
  invoices: Invoice[]
  contracts: Contract[]
  totalRecords: number
  loading: boolean
  first: number
  rows: number
  sortOrder: number | undefined
  sortField: string
}>()
const emit = defineEmits([
  'edit-invoice',
  'delete-invoice',
  'open-drawer',
  'load-invoices',
  'filter',
  'sort',
  'update-status',
])
const onPage = (event: any) => {
  emit('load-invoices', event)
}

const getRoomName = (contractId: number) => {
  return contracts?.find((contract: Contract) => contract.id === contractId)?.room?.name || ''
}

const statuses = ref(
  Object.entries(INVOICE_STATUSES).map(([value, label]) => ({
    label: label,
    command: () => {
      emit('update-status', value)
    },
  })),
)
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
        {{ getRoomName(data.contractId) }}
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
        <div class="flex items-end justify-center relative w-10 h-10">
          <SpeedDial
            :model="statuses"
            direction="left"
            style="position: absolute; top: calc(50% - 2rem); right: 0"
          />
        </div>
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
