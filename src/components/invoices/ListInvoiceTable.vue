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
        <div class="text-base text-gray-600">
          Tháng <strong>{{ data.month }}/{{ data.year }}</strong>
        </div>
        <div class="text-sm text-gray-300">
          Từ <span class="font-semibold">{{ formatDate(data.periodStart) }}</span> đến
          <span class="font-semibold">{{ formatDate(data.periodEnd) }}</span>
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
        <SpeedDial
          :model="statuses"
          :radius="120"
          type="quarter-circle"
          direction="down-right"
          :style="{ position: 'absolute', left: 0, top: 0 }"
        >
          <template #button="{ toggleCallback }">
            <Button variant="outlined" class="border" icon="pi-sync" @click="toggleCallback">
            </Button>
          </template>
          <template #item="{ item, toggleCallback }">
            <div
              class="flex flex-col items-center justify-between gap-2 p-2 border rounded border-surface-200 dark:border-surface-700 w-20 cursor-pointer"
              @click="toggleCallback"
            >
              <span>
                {{ item.label }}
              </span>
            </div>
          </template>
        </SpeedDial>
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
