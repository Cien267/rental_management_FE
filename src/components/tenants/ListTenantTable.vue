<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { formatDate } from '@/helpers/utils'
import { getTenantGenderValue, getTenantGenderSeverity } from '@/transformers/tenants'
import { TENANT_GENDERS } from '@/constants/tenants'
import type { Tenant } from '@/types/tenant'
import type { Room } from '@/types/room'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const { tenants, totalRecords, loading, first, rows, sortOrder, sortField } = defineProps<{
  tenants: Tenant[]
  rooms: Room[]
  totalRecords: number
  loading: boolean
  first: number
  rows: number
  sortOrder: number | undefined
  sortField: string
}>()
const emit = defineEmits([
  'edit-tenant',
  'delete-tenant',
  'open-drawer',
  'load-tenants',
  'filter',
  'sort',
])
const filters = defineModel<any>('filters', { default: false })
const onPage = (event: any) => {
  emit('load-tenants', event)
}

const onFilter = (event: any) => {
  const filterParams = {
    fullName: event.filters.fullName?.value || undefined,
    phone: event.filters.phone?.value || undefined,
    gender: event.filters.gender?.value || undefined,
  }
  emit('filter', filterParams)
}

const onSort = (event: any) => {
  emit('sort', event)
}

const genderOptions = Object.entries(TENANT_GENDERS).map(([value, label]) => ({ label, value }))

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
    :value="tenants"
    :globalFilterFields="['fullName', 'phone', 'gender']"
    :loading="loading"
    selectionMode="single"
    :metaKeySelection="false"
    v-model:filters="filters"
    :filterDelay="500"
    exportFilename="Người thuê nhà"
    :lazy="true"
    :first="first"
    :sortOrder="sortOrder"
    :sortField="sortField"
    :totalRecords="totalRecords"
    scrollable
    scrollHeight="400px"
    @rowSelect="emit('open-drawer', $event.data)"
    @page="onPage"
    @filter="onFilter"
    @sort="onSort"
  >
    <template #empty> Chưa có người thuê nhà nào </template>
    <template #loading> Đang tải dữ liệu </template>
    <template #header>
      <div class="text-end pb-4">
        <Button icon="pi pi-external-link" label="Export" @click="exportCSV" />
      </div>
    </template>
    <Column field="fullName" header="Tên" sortable>
      <template #body="{ data }">
        {{ data.fullName }}
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
    <Column field="gender" header="Giới tính">
      <template #body="slotProps">
        <Tag
          :value="getTenantGenderValue(slotProps.data.gender)"
          :severity="getTenantGenderSeverity(slotProps.data.gender)"
        />
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <Select
          v-model="filterModel.value"
          @change="filterCallback()"
          :options="genderOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Chon giới tinh"
          style="min-width: 12rem"
          :showClear="true"
        >
          <template #option="slotProps">
            <Tag
              :value="getTenantGenderValue(slotProps.option.value)"
              :severity="getTenantGenderSeverity(slotProps.option.value)"
            />
          </template>
        </Select>
      </template>
    </Column>
    <Column field="phone" header="SĐT">
      <template #body="{ data }">
        {{ data.phone }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          @keypress.enter="filterCallback()"
          placeholder="Tìm theo sdt"
        /> </template
    ></Column>
    <Column field="dateOfBirth" header="Ngày sinh">
      <template #body="slotProps">
        {{ formatDate(slotProps.data.dateOfBirth ?? '', 'DD/MM/YYYY') }}
      </template>
    </Column>
    <Column field="" header="Phòng">
      <template #body="{ data }">
        {{ data.room?.name || '---' }}
      </template>
    </Column>

    <Column field="" header="Hành động">
      <template #body="slotProps">
        <Button
          label="Sửa"
          size="small"
          severity="secondary"
          class="mr-2"
          @click.stop="emit('edit-tenant', slotProps.data)"
        />
        <Button
          label="Xóa"
          size="small"
          severity="danger"
          @click.stop="emit('delete-tenant', slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>
</template>
