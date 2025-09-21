<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { formatCurrency, formatDate } from '@/helpers/utils'
import { getContractStatusValue, getContractStatusSeverity } from '@/transformers/contracts'
import { CONTRACT_STATUSES } from '@/constants/contracts'
import type { Contract } from '@/types/contract'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const { contracts, totalRecords, loading, first, rows } = defineProps<{
  contracts: Contract[]
  totalRecords: number
  loading: boolean
  first: number
  rows: number
}>()
const emit = defineEmits([
  'edit-contract',
  'delete-contract',
  'open-drawer',
  'load-contracts',
  'filter',
])
const filters = defineModel<any>('filters', { default: false })
const onPage = (event: any) => {
  emit('load-contracts', event)
}

const onFilter = (event: any) => {
  const filterParams = {
    name: event.filters.name?.value || undefined,
    status: event.filters.status?.value || undefined,
  }
  emit('filter', filterParams)
}

const statusOptions = Object.entries(CONTRACT_STATUSES).map(([value, label]) => ({ label, value }))

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
    :value="contracts"
    :globalFilterFields="['name', 'status']"
    :loading="loading"
    selectionMode="single"
    :metaKeySelection="false"
    v-model:filters="filters"
    :filterDelay="500"
    exportFilename="Hợp đồng"
    :lazy="true"
    :first="first"
    :totalRecords="totalRecords"
    scrollable
    scrollHeight="400px"
    @rowSelect="emit('open-drawer', $event.data)"
    @page="onPage"
    @filter="onFilter"
  >
    <template #empty> Chưa có hợp đồng nào </template>
    <template #loading> Đang tải dữ liệu </template>
    <template #header>
      <div class="text-end pb-4">
        <Button icon="pi pi-external-link" label="Export" @click="exportCSV" />
      </div>
    </template>
    <Column field="" header="Người kí hợp đồng">
      <template #body="{ data }">
        {{ data.tenant.fullName }}
      </template>
    </Column>
    <Column field="" header="Phòng">
      <template #body="{ data }">
        {{ data.room.name }}
      </template>
    </Column>
    <Column field="depositAmount" header="Cọc">
      <template #body="{ data }">
        {{ formatCurrency(data.depositAmount) }}
      </template>
    </Column>
    <Column field="status" header="Trạng thái">
      <template #body="slotProps">
        <Tag
          :value="getContractStatusValue(slotProps.data.status)"
          :severity="getContractStatusSeverity(slotProps.data.status)"
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
              :value="getContractStatusValue(slotProps.option.value)"
              :severity="getContractStatusSeverity(slotProps.option.value)"
            />
          </template>
        </Select>
      </template>
    </Column>
    <Column field="startDate" header="Ngày bắt đầu">
      <template #body="{ data }">
        {{ formatDate(data.startDate, 'DD/MM/YYYY') }}
      </template>
    </Column>
    <Column field="endDate" header="Ngày kết thúc">
      <template #body="{ data }">
        {{ formatDate(data.endDate, 'DD/MM/YYYY') }}
      </template>
    </Column>
    <Column field="" header="Hành động">
      <template #body="slotProps">
        <Button
          label="Sửa"
          size="small"
          severity="secondary"
          class="mr-2"
          @click.stop="emit('edit-contract', slotProps.data)"
        />
        <Button
          label="Xóa"
          size="small"
          severity="danger"
          @click.stop="emit('delete-contract', slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>
</template>
