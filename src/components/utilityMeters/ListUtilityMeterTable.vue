<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { UtilityMeter, MeterType } from '@/types/utilityMeter'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import {
  getUtilityMeterStatusValue,
  getUtilityMeterStatusSeverity,
} from '@/transformers/utilityMeters'
import { UTILITY_METER_TYPES } from '@/constants/utilityMeters'

const { utilityMeters, totalRecords, loading, first, rows } = defineProps<{
  utilityMeters: UtilityMeter[]
  totalRecords: number
  loading: boolean
  first: number
  rows: number
}>()
const emit = defineEmits([
  'edit-utility-meter',
  'delete-utility-meter',
  'open-drawer',
  'load-utility-meters',
  'filter',
  'sort',
])
const onPage = (event: any) => {
  emit('load-utility-meters', event)
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
    :value="utilityMeters"
    :globalFilterFields="['name', 'status']"
    :loading="loading"
    selectionMode="single"
    :metaKeySelection="false"
    :filterDelay="500"
    exportFilename="Cài đặt công tơ"
    :lazy="true"
    :first="first"
    :totalRecords="totalRecords"
    scrollable
    scrollHeight="400px"
    @rowSelect="emit('open-drawer', $event.data)"
    @page="onPage"
  >
    <template #empty> Chưa có cài đặt công tơ nào </template>
    <template #loading> Đang tải dữ liệu </template>
    <template #header>
      <div class="text-end pb-4">
        <Button icon="pi pi-external-link" label="Export" @click="exportCSV" />
      </div>
    </template>
    <Column field="amount" header="Loại">
      <template #body="{ data }">
        {{ UTILITY_METER_TYPES[data.meterType as MeterType] }}
      </template>
    </Column>
    <Column field="status" header="Trạng thái">
      <template #body="slotProps">
        <Tag
          :value="getUtilityMeterStatusValue(slotProps.data.active)"
          :severity="getUtilityMeterStatusSeverity(slotProps.data.active)"
        />
      </template>
    </Column>
    <Column field="unit" header="Đơn vị đo"> </Column>
    <Column field="" header="Phòng">
      <template #body="{ data }">
        {{ data.room?.name }}
      </template>
    </Column>
    <Column field="" header="Hành động">
      <template #body="slotProps">
        <Button
          label="Sửa"
          size="small"
          severity="secondary"
          class="mr-2"
          @click.stop="emit('edit-utility-meter', slotProps.data)"
        />
        <Button
          label="Xóa"
          size="small"
          severity="danger"
          @click.stop="emit('delete-utility-meter', slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>
</template>
