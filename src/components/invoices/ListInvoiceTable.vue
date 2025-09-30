<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { formatDate } from '@/helpers/utils'
import { getTenantGenderValue, getTenantGenderSeverity } from '@/transformers/invoices'
import { TENANT_GENDERS } from '@/constants/invoices'
import type { Invoice } from '@/types/invoice'
import type { Room } from '@/types/room'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const { invoices, totalRecords, loading, first, rows, sortOrder, sortField } = defineProps<{
  invoices: Invoice[]
  rooms: Room[]
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
])
const filters = defineModel<any>('filters', { default: false })
const onPage = (event: any) => {
  emit('load-invoices', event)
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
</script>

<template>
  <DataTable
    stripedRows
    paginator
    removableSort
    dataKey="id"
    :rows="rows"
    :rowsPerPageOptions="[5, 10, 15, 20, 50]"
    :value="invoices"
    :loading="loading"
    selectionMode="single"
    :metaKeySelection="false"
    v-model:filters="filters"
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
    @filter="onFilter"
    @sort="onSort"
  >
    <template #empty> Chưa có hóa đơn nào </template>
    <template #loading> Đang tải dữ liệu </template>
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
    <Column field="" header="Hành động">
      <template #body="slotProps">
        <!-- <Button
          label="Sửa"
          size="small"
          severity="secondary"
          class="mr-2"
          @click.stop="emit('edit-invoice', slotProps.data)"
        /> -->
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
