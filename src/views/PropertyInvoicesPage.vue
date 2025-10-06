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
          label="Tạo hóa đơn"
          icon="pi pi-plus"
          class="!bg-sky-600 border-0"
          @click="onAddInvoice"
        />
      </div>

      <PageLoading v-if="loading" />

      <div v-else class="space-y-6">
        <FilterInvoice
          :rooms="rooms"
          :selected-room="selectedRoom"
          :selected-date="selectedDate"
          :selected-status="selectedStatus"
          @select-room="handleSelectRoomFilter"
          @select-date="handleSelectDateFilter"
          @select-status="handleSelectStatusFilter"
        ></FilterInvoice>
        <!-- Table -->
        <ListInvoiceTable
          :invoices="invoices"
          :loading="loading"
          :rooms="rooms"
          :total-records="totalRecords"
          :first="first"
          :rows="rows"
          :sort-order="sortOrder"
          :sort-field="sortField"
          :property-id="propertyId"
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
      :rooms="rooms"
      @invoice-saved="handleInvoiceSaved"
    />

    <ConfirmDeleteModal
      ref="deleteModal"
      :data="deletingInvoice"
      prefix="hóa đơn này"
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
import ListInvoiceTable from '@/components/invoices/ListInvoiceTable.vue'
import DetailInvoiceDrawer from '@/components/invoices/DetailInvoiceDrawer.vue'
import ConfirmDeleteModal from '@/components/base/organisms/ConfirmDeleteModal.vue'
import { deleteInvoice, getInvoices } from '@/services/api/invoiceService'
import { getRooms } from '@/services/api/roomService'
import type { Room } from '@/types/room'

const route = useRoute()
const store = useMainStore()
const { tSuccess, tError } = useCustomToast()

const loading = ref<boolean>(false)
const invoices = ref<Invoice[]>([])
const rooms = ref<Room[]>([])
const selectedRoom = ref<Room | any>({
  id: 0,
  name: 'Tất cả',
})
const selectedDate = ref<Date | null>(null)
const selectedStatus = ref<string | null>(null)
const selectedInvoice = ref<Invoice | null>(null)
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
const deletingInvoice = ref<Invoice | null>(null)

const onAddInvoice = () => {
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
  selectedRoom.value = {
    id: 0,
    name: 'Tất cả',
  }
  loadInvoices()
  tSuccess('Thành công', 'Thêm hóa đơn thành công')
}

const handleSelectRoomFilter = (room: Room | any) => {
  selectedRoom.value = room
  if (room.id) filterParams.value = { ...filterParams.value, roomId: room.id }
  else {
    const { roomId, ...rest } = filterParams.value
    filterParams.value = { ...rest }
  }
  loadInvoices()
}

const handleSelectDateFilter = (date: Date | null) => {
  selectedDate.value = date
  const month = date ? date.getMonth() + 1 : null
  const year = date ? date.getFullYear() : null
  if (month) filterParams.value = { ...filterParams.value, month }
  else {
    const { month, ...rest } = filterParams.value
    filterParams.value = { ...rest }
  }
  if (year) filterParams.value = { ...filterParams.value, year }
  else {
    const { year, ...rest } = filterParams.value
    filterParams.value = { ...rest }
  }
  loadInvoices()
}

const handleSelectStatusFilter = (status: string | null) => {
  selectedStatus.value = status
  if (status) filterParams.value = { ...filterParams.value, status }
  else {
    const { status, ...rest } = filterParams.value
    filterParams.value = { ...rest }
  }
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
    invoices.value = [
      // {
      //   id: 7,
      //   contractId: 7,
      //   propertyId: 9,
      //   roomId: 9,
      //   invoiceDate: '2025-10-05',
      //   periodStart: '2025-09-01',
      //   periodEnd: '2025-09-30',
      //   rentAmount: '3500000.00',
      //   utilitiesAmount: '1568000.00',
      //   extraFeesAmount: '200000.00',
      //   totalAmount: '5268000.00',
      //   status: 'unpaid',
      //   notes: '',
      //   utilitiesBreakdown:
      //     '[{"meterType":"electricity","meterId":8,"unit":"kWh","previousReading":668,"latestReading":1000,"usage":332,"pricePerUnit":4000,"total":1328000},{"meterType":"water","meterId":18,"unit":"m3","previousReading":42,"latestReading":50,"usage":8,"pricePerUnit":30000,"total":240000}]',
      //   extraFeesBreakdown:
      //     '[{"id":2,"name":"Phí vệ sinh","description":"tiền dọn dẹp vệ sinh hằng tháng, thu gom rác hằng ngày","amount":"100000.00","chargeType":"monthly"},{"id":3,"name":"Internet","description":"internet do","amount":"100000.00","chargeType":"monthly"}]',
      //   month: 9,
      //   year: 2025,
      //   createdAt: '2025-10-05T08:24:12.000Z',
      //   updatedAt: '2025-10-05T08:24:12.000Z',
      //   contract: {
      //     id: 7,
      //     roomId: 9,
      //     tenantId: 18,
      //     startDate: '2025-07-01',
      //     endDate: '2026-01-31',
      //     depositAmount: '3500000.00',
      //     paymentCycle: 'monthly',
      //     status: 'active',
      //     propertyId: 9,
      //     createdAt: '2025-10-05T08:22:13.000Z',
      //     updatedAt: '2025-10-05T08:22:13.000Z',
      //   },
      //   room: {
      //     id: 9,
      //     propertyId: 9,
      //     name: 'Phòng 401',
      //     floor: 4,
      //     area: '30.00',
      //     price: '3500000.00',
      //     status: 'occupied',
      //     amenities: '"ban công, điều hòa, máy giặt, tủ lạnh, bàn bếp, quạt trần, tủ quần áo"',
      //     maxOccupants: 4,
      //     currentOccupants: 0,
      //     note: 'phòng của tôi',
      //     createdAt: '2025-09-20T01:26:15.000Z',
      //     updatedAt: '2025-10-05T08:21:29.000Z',
      //   },
      // },
    ]
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

const loadRooms = async () => {
  const paramQuery = {
    limit: 1000,
    page: 1,
  }
  if (!propertyId.value) return
  loading.value = true
  try {
    const data = await getRooms(propertyId.value, paramQuery)
    rooms.value = data.results
  } catch (e: any) {
    const eMsg = e?.response?.data?.message ?? 'Không thể tải danh sách phòng'
    tError('Lỗi', eMsg)
    rooms.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadProperty(), loadRooms(), loadInvoices()])
})
</script>

<style scoped></style>
