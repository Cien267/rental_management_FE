<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { UtilityMeterReading } from '@/types/utilityMeterReading'
import type { UtilityMeter, MeterType } from '@/types/utilityMeter'
import { UTILITY_METER_TYPES } from '@/constants/utilityMeters'
import type { Room } from '@/types/room'
import Button from 'primevue/button'
import { formatNumber, formatDate } from '@/helpers/utils'

const {
  utilityMeterReadings,
  utilityMeterSettings,
  rooms,
  totalRecords,
  loading,
  first,
  rows,
  sortOrder,
  sortField,
} = defineProps<{
  utilityMeterReadings: UtilityMeterReading[]
  rooms: Room[]
  utilityMeterSettings?: UtilityMeter[] | null
  totalRecords: number
  loading: boolean
  first: number
  rows: number
  sortOrder: number | undefined
  sortField: string
}>()
const emit = defineEmits([
  'edit-utility-meter-reading',
  'delete-utility-meter-reading',
  'open-drawer',
  'load-utility-meter-readings',
])
const onPage = (event: any) => {
  emit('load-utility-meter-readings', event)
}

const getMeterType = (utilityMeterId: number) => {
  const utilityMeter = utilityMeterSettings?.find((u) => u.id === utilityMeterId)
  if (utilityMeter) return UTILITY_METER_TYPES[utilityMeter.meterType as MeterType]
  return ''
}

const getRoom = (roomId: number) => {
  const room = rooms?.find((r) => r.id === roomId)
  if (room) return room.name
  return ''
}
</script>

<template>
  <DataTable
    stripedRows
    paginator
    removableSort
    dataKey="id"
    :rows="rows"
    :rowsPerPageOptions="[5, 10, 15, 20, 50]"
    :value="utilityMeterReadings"
    :globalFilterFields="['fullName', 'phone', 'gender']"
    :loading="loading"
    selectionMode="single"
    :metaKeySelection="false"
    :filterDelay="500"
    :lazy="true"
    :first="first"
    :sortOrder="sortOrder"
    :sortField="sortField"
    :totalRecords="totalRecords"
    scrollable
    scrollHeight="400px"
    @rowSelect="emit('open-drawer', $event.data)"
    @page="onPage"
  >
    <template #empty> Chưa có dữ liệu số đo nào </template>
    <template #loading> Đang tải dữ liệu </template>
    <Column field="" header="Loại">
      <template #body="{ data }">
        {{ getMeterType(data.utilityMeterId) }}
      </template>
    </Column>
    <Column field="" header="Phòng">
      <template #body="{ data }">
        {{ getRoom(data.roomId) }}
      </template>
    </Column>
    <Column field="" header="Giá trị">
      <template #body="{ data }">
        {{ formatNumber(data.value) }}
      </template>
    </Column>
    <Column field="" header="Ngày nhập">
      <template #body="{ data }">
        {{ formatDate(data.readingDate ?? '', 'DD/MM/YYYY') }}
      </template>
    </Column>
    <Column field="" header="Hành động">
      <template #body="slotProps">
        <Button
          label="Sửa"
          size="small"
          severity="secondary"
          class="mr-2"
          @click.stop="emit('edit-utility-meter-reading', slotProps.data)"
        />
        <Button
          label="Xóa"
          size="small"
          severity="danger"
          @click.stop="emit('delete-utility-meter-reading', slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>
</template>
