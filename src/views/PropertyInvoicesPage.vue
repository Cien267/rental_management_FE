<template>
  <DefaultLayout :selected-property="selectedProperty">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="text-2xl font-semibold text-gray-900">Hóa đơn</div>
          <div class="text-base text-gray-300">Quản lý nhập xuất hóa đơn</div>
        </div>
        <Button
          label="Tạo xóa đơn"
          icon="pi pi-plus"
          class="!bg-sky-600 border-0"
          @click="onAddInvoice"
        />
      </div>

      <PageLoading v-if="loading" />

      <div v-else class="space-y-6">
        <FilterInvoice
          :contracts="contracts"
          :selected-contract="selectedContract"
          @select-contract="handleSelectContractFilter"
        ></FilterInvoice>
        <!-- Table -->
        <ListContractTable
          :invoices="invoices"
          :loading="loading"
          :contracts="contracts"
          :total-records="totalRecords"
          :first="first"
          :rows="rows"
          :sort-order="sortOrder"
          :sort-field="sortField"
          @open-drawer="openDrawer"
          @delete-invoice="onDeleteInvoice"
          @load-invoices="loadInvoices"
        />
      </div>
    </div>
    <DetailInvoiceDrawer v-model:visible="isDrawerOpen" :selected-invoice="selectedInvoice" />
    <!-- Modals -->
    <UpSertInvoiceModal
      ref="invoiceModal"
      :property-id="propertyId"
      :contracts="contracts"
      :invoice="editingInvoice"
      @invoice-saved="handleInvoiceSaved"
      @invoice-updated="handleInvoiceUpdated"
    />

    <ConfirmDeleteModal
      ref="deleteModal"
      :data="deletingInvoice"
      nameKey="name"
      @confirm-delete="handleConfirmDelete"
      @cancel-delete="handleCancelDelete"
    />
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageLoading from '@/components/base/atoms/PageLoading.vue'
import UpSertInvoiceModal from '@/components/invoices/UpSertInvoiceModal.vue'
import FilterInvoice from '@/components/invoices/FilterInvoice.vue'
import type { Invoice } from '@/types/invoice'
import type { Property, PropertyUI } from '@/types/property'
import { getProperty } from '@/services/api/propertyService'
import { transformPropertyToUI } from '@/transformers/properties'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useCustomToast } from '@/composables/base/useCustomToast'
import ListContractTable from '@/components/invoices/ListContractTable.vue'
import ConfirmDeleteModal from '@/components/base/organisms/ConfirmDeleteModal.vue'
import { getContracts } from '@/services/api/contractService'
import type { Contract } from '@/types/contract'
import { deleteInvoice, getInvoices } from '@/services/api/invoiceService'

const route = useRoute()
const store = useMainStore()
const { tSuccess, tError } = useCustomToast()

const loading = ref<boolean>(false)
const invoices = ref<Invoice[]>([])
const contracts = ref<Contract[]>([])
const selectedContract = ref<Contract | any>({
  id: 0,
  name: 'Tất cả',
})
const selectedInvoice = ref<Invoice>()
const totalRecords = ref<number>(0)
const first = ref(0)
const rows = ref(10)
const sortOrder = ref<number | undefined>()
const sortField = ref<string>('')
const isDrawerOpen = ref<boolean>(false)
const propertyId = computed(() => Number(route.params.id))
const selectedProperty = ref<PropertyUI | null>(null)
const filterParams = ref<any>({})
const sortBy = ref<string>('')
const invoiceModal = ref<InstanceType<typeof UpSertInvoiceModal> | null>(null)
const deleteModal = ref<InstanceType<typeof ConfirmDeleteModal> | null>(null)
const editingInvoice = ref<Invoice | null>(null)
const deletingInvoice = ref<Invoice | null>(null)

const onAddInvoice = () => {
  editingInvoice.value = null
  invoiceModal.value?.open()
}

const onDeleteInvoice = (invoice: Invoice) => {
  deletingInvoice.value = invoice
  deleteModal.value?.open()
}

const openDrawer = (invoice: Invoice) => {
  selectedInvoice.value = invoice
  isDrawerOpen.value = true
}

const handleConfirmDelete = async (invoice: Invoice) => {
  try {
    deleteModal.value?.setLoading(true)
    await deleteInvoice(invoice.id, propertyId.value)
    await loadInvoices()
    tSuccess('Thành công', 'Xóa hóa đơn thành công')
  } catch (error: any) {
    const eMsg = error?.response?.data?.message ?? 'Xóa hóa đơn thất bại'
    tError('Lỗi', eMsg)
  } finally {
    deleteModal.value?.setLoading(false)
    deleteModal.value?.close()
  }
}

const handleCancelDelete = () => {
  deletingInvoice.value = null
  deleteModal.value?.close()
}

const handleInvoiceSaved = () => {
  filterParams.value = {}
  first.value = 0
  selectedContract.value = {
    id: 0,
    name: 'Tất cả',
  }
  loadInvoices()
  tSuccess('Thành công', 'Thêm hóa đơn thành công')
}

const handleInvoiceUpdated = () => {
  filterParams.value = {}
  first.value = 0
  selectedContract.value = {
    id: 0,
    name: 'Tất cả',
  }
  loadInvoices()
  tSuccess('Thành công', 'Cập nhật hóa đơn thành công')
}

const handleSelectContractFilter = (contract: Contract | any) => {
  selectedContract.value = contract
  filterParams.value = { ...filterParams.value, contractId: contract.id || '' }
  loadInvoices()
}

const loadInvoices = async (params: any = null) => {
  const paramQuery: any = {
    limit: 10,
    page: 1,
    ...filterParams.value,
  }
  if (sortBy.value) paramQuery.sortBy = sortBy.value
  if (params) {
    paramQuery.limit = params.rows
    paramQuery.page = params.page + 1
    first.value = params.first
    rows.value = params.rows
  }
  if (!propertyId.value) return
  loading.value = true
  try {
    const data = await getInvoices(propertyId.value, paramQuery)
    invoices.value = data.results
    totalRecords.value = data.totalResults
  } catch (e: any) {
    console.error(e)
    const eMsg = e?.response?.data?.message ?? 'Không thể tải danh sách hóa đơn'
    tError('Lỗi', eMsg)
    invoices.value = []
  } finally {
    loading.value = false
  }
}

const loadProperty = async () => {
  try {
    const prop: Property = await getProperty(propertyId.value)
    const ui = transformPropertyToUI(prop)
    selectedProperty.value = ui
    store.setSelectedProperty(prop)
  } catch {
    selectedProperty.value = null
    store.setSelectedProperty(null)
  }
}

const loadContracts = async () => {
  const paramQuery = {
    limit: 1000,
    page: 1,
  }
  if (!propertyId.value) return
  loading.value = true
  try {
    const data = await getContracts(propertyId.value, paramQuery)
    contracts.value = data.results
  } catch (e: any) {
    const eMsg = e?.response?.data?.message ?? 'Không thể tải danh sách hợp đồng'
    tError('Lỗi', eMsg)
    contracts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadProperty(), loadContracts(), loadInvoices()])
})
</script>

<style scoped></style>
