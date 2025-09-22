<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { formatCurrency } from '@/helpers/utils'
import type { ExtraFee, ChargeType } from '@/types/extraFee'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { getExtraFeeStatusValue, getExtraFeeStatusSeverity } from '@/transformers/extraFees'
import { CHARGE_TYPES } from '@/constants/extraFees'

const { extraFees, totalRecords, loading, first, rows } = defineProps<{
  extraFees: ExtraFee[]
  totalRecords: number
  loading: boolean
  first: number
  rows: number
}>()
const emit = defineEmits([
  'edit-extra-fee',
  'delete-extra-fee',
  'open-drawer',
  'load-extra-fees',
  'filter',
  'sort',
])
const onPage = (event: any) => {
  emit('load-extra-fees', event)
}

const dt = ref()

const exportCSV = () => {
  dt.value.exportCSV()
}
</script>

<template>
  <DataTable
    ref="dt"
    stripedRows
    paginator
    removableSort
    dataKey="id"
    filterDisplay="row"
    :rows="rows"
    :rowsPerPageOptions="[5, 10, 15, 20, 50]"
    :value="extraFees"
    :globalFilterFields="['name', 'status']"
    :loading="loading"
    selectionMode="single"
    :metaKeySelection="false"
    :filterDelay="500"
    exportFilename="Chi phí khác"
    :lazy="true"
    :first="first"
    :totalRecords="totalRecords"
    scrollable
    scrollHeight="400px"
    @rowSelect="emit('open-drawer', $event.data)"
    @page="onPage"
  >
    <template #empty> Chưa có phí khác nào </template>
    <template #loading> Đang tải dữ liệu </template>
    <template #header>
      <div class="text-end pb-4">
        <Button icon="pi pi-external-link" label="Export" @click="exportCSV" />
      </div>
    </template>
    <Column field="name" header="Tên"> </Column>
    <Column field="amount" header="Giá">
      <template #body="{ data }">
        {{ formatCurrency(data.amount) }}
      </template>
    </Column>
    <Column field="status" header="Trạng thái">
      <template #body="slotProps">
        <Tag
          :value="getExtraFeeStatusValue(slotProps.data.isActive)"
          :severity="getExtraFeeStatusSeverity(slotProps.data.isActive)"
        />
      </template>
    </Column>
    <Column field="chargeType" header="Kiểu thu phí">
      <template #body="{ data }">
        {{ CHARGE_TYPES[data.chargeType as ChargeType] }}
      </template>
    </Column>
    <Column field="" header="Hành động">
      <template #body="slotProps">
        <Button
          label="Sửa"
          size="small"
          severity="secondary"
          class="mr-2"
          @click.stop="emit('edit-extra-fee', slotProps.data)"
        />
        <Button
          label="Xóa"
          size="small"
          severity="danger"
          @click.stop="emit('delete-extra-fee', slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>
</template>
