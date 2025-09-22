<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { formatCurrency } from '@/helpers/utils'
import { getRoomStatusValue, getRoomStatusSeverity } from '@/transformers/rooms'
import { ROOM_STATUSES } from '@/constants/rooms'
import type { Room } from '@/types/room'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const { rooms, totalRecords, loading, first, rows } = defineProps<{
  rooms: Room[]
  totalRecords: number
  loading: boolean
  first: number
  rows: number
}>()
const emit = defineEmits([
  'edit-room',
  'delete-room',
  'open-drawer',
  'load-rooms',
  'filter',
  'sort',
])
const filters = defineModel<any>('filters', { default: false })
const onPage = (event: any) => {
  emit('load-rooms', event)
}

const onFilter = (event: any) => {
  const filterParams = {
    name: event.filters.name?.value || undefined,
    status: event.filters.status?.value || undefined,
  }
  emit('filter', filterParams)
}

const onSort = (event: any) => {
  let sortBy = ''
  if (event.sortField && event.sortOrder) {
    sortBy = `${event.sortField}:${event.sortOrder === 1 ? 'asc' : 'desc'}`
  }
  emit('sort', sortBy)
}

const statusOptions = Object.entries(ROOM_STATUSES).map(([value, label]) => ({ label, value }))

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
    :value="rooms"
    :globalFilterFields="['name', 'status']"
    :loading="loading"
    selectionMode="single"
    :metaKeySelection="false"
    v-model:filters="filters"
    :filterDelay="500"
    exportFilename="Phòng trọ"
    :lazy="true"
    :first="first"
    :totalRecords="totalRecords"
    scrollable
    scrollHeight="400px"
    @rowSelect="emit('open-drawer', $event.data)"
    @page="onPage"
    @filter="onFilter"
    @sort="onSort"
  >
    <template #empty> Chưa có phòng nào </template>
    <template #loading> Đang tải dữ liệu </template>
    <template #header>
      <div class="text-end pb-4">
        <Button icon="pi pi-external-link" label="Export" @click="exportCSV" />
      </div>
    </template>
    <Column field="name" header="Tên" sortable>
      <template #body="{ data }">
        {{ data.name }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          @keypress.enter="filterCallback()"
          placeholder="Tìm theo tên"
        />
      </template>
    </Column>
    <Column field="floor" header="Tầng" sortable></Column>
    <Column field="price" header="Giá" sortable>
      <template #body="{ data }">
        {{ formatCurrency(data.price) }}
      </template>
    </Column>
    <Column field="status" header="Trạng thái">
      <template #body="slotProps">
        <Tag
          :value="getRoomStatusValue(slotProps.data.status)"
          :severity="getRoomStatusSeverity(slotProps.data.status)"
        />
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <Select
          v-model="filterModel.value"
          @change="filterCallback()"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Chon trạng thái"
          style="min-width: 12rem"
          :showClear="true"
        >
          <template #option="slotProps">
            <Tag
              :value="getRoomStatusValue(slotProps.option.value)"
              :severity="getRoomStatusSeverity(slotProps.option.value)"
            />
          </template>
        </Select>
      </template>
    </Column>
    <Column field="maxOccupants" header="Số người thuê tối đa"></Column>
    <Column field="" header="Hành động">
      <template #body="slotProps">
        <Button
          label="Sửa"
          size="small"
          severity="secondary"
          class="mr-2"
          @click.stop="emit('edit-room', slotProps.data)"
        />
        <Button
          label="Xóa"
          size="small"
          severity="danger"
          @click.stop="emit('delete-room', slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>
</template>
