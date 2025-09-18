<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { FilterMatchMode } from '@primevue/core/api'
import { getRoomStatusValue, getRoomStatusSeverity } from '@/transformers/rooms'
import { RoomStatusEnum } from '@/types/room'
import type { Room } from '@/types/room'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const { rooms, loading } = defineProps<{ rooms: Room[]; loading: boolean }>()
const emit = defineEmits(['edit-room', 'delete-room', 'open-drawer'])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
})

const statusOptions = ref([...RoomStatusEnum.options])

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
    :rows="15"
    :rowsPerPageOptions="[5, 10, 15, 20, 50]"
    :value="rooms"
    :globalFilterFields="['name', 'status']"
    :loading="loading"
    selectionMode="single"
    :metaKeySelection="false"
    v-model:filters="filters"
    exportFilename="Phòng trọ"
    @rowSelect="emit('open-drawer', $event.data)"
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
          @input="filterCallback()"
          placeholder="Tìm theo tên"
        />
      </template>
    </Column>
    <Column field="floor" header="Tầng" sortable></Column>
    <Column field="price" header="Giá" sortable></Column>
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
          placeholder="Chon trạng thái"
          style="min-width: 12rem"
          :showClear="true"
        >
          <template #option="slotProps">
            <Tag
              :value="getRoomStatusValue(slotProps.option)"
              :severity="getRoomStatusSeverity(slotProps.option)"
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
