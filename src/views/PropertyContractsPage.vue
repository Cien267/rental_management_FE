<template>
  <DefaultLayout :selected-property="selectedProperty">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="text-2xl font-semibold text-gray-900">Hợp đồng</div>
          <div class="text-base text-gray-300">Quản lý hợp đồng và trạng thái</div>
        </div>
        <Button
          label="Thêm hợp đồng"
          icon="pi pi-plus"
          class="!bg-sky-600 border-0"
          @click="onAddContract"
        />
      </div>

      <PageLoading v-if="loading" />

      <div v-else class="space-y-6">
        <!-- Stat cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <Tag severity="secondary" value="Tất cả"></Tag>
                <p class="text-4xl font-bold text-gray-600">{{ stats.total }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <Tag severity="success" value="Còn hiệu lực"></Tag>
                <p class="text-4xl font-bold text-green-600">{{ stats.active }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <Tag severity="info" value="Đã kết thúc"></Tag>
                <p class="text-4xl font-bold text-blue-600">{{ stats.ended }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <Tag severity="warn" value="Đã hủy"></Tag>
                <p class="text-4xl font-bold text-orange-600">{{ stats.cancelled }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <ListContractTable
          :contracts="contracts"
          :loading="loading"
          :total-records="totalRecords"
          :first="first"
          :rows="rows"
          v-model:filters="filters"
          @open-drawer="openDrawer"
          @edit-contract="onEditContract"
          @delete-contract="onDeleteContract"
          @load-contracts="loadContracts"
          @filter="handleFilter"
          @sort="handleSort"
        />
      </div>
    </div>

    <!-- Drawer: contract details -->
    <DetailContractDrawer v-model:visible="isDrawerOpen" :selected-contract="selectedContract" />
    <!-- Modals -->
    <UpSertContractModal
      ref="contractModal"
      :property-id="propertyId"
      :contract="editingContract"
      :rooms="rooms"
      @contract-saved="handleContractSaved"
      @contract-updated="handleContractUpdated"
    />

    <ConfirmDeleteModal
      ref="deleteModal"
      :data="deletingContract"
      nameKey="name"
      @confirm-delete="handleConfirmDelete"
      @cancel-delete="handleCancelDelete"
    />
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageLoading from '@/components/base/atoms/PageLoading.vue'
import UpSertContractModal from '@/components/contracts/UpSertContractModal.vue'
import type { Contract } from '@/types/contract'
import type { Room } from '@/types/room'
import type { Property, PropertyUI } from '@/types/property'
import { getProperty } from '@/services/api/propertyService'
import { getRooms } from '@/services/api/roomService'
import { getContracts, deleteContract } from '@/services/api/contractService'
import { transformPropertyToUI } from '@/transformers/properties'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useCustomToast } from '@/composables/base/useCustomToast'
import DetailContractDrawer from '@/components/contracts/DetailContractDrawer.vue'
import ListContractTable from '@/components/contracts/ListContractTable.vue'
import ConfirmDeleteModal from '@/components/base/organisms/ConfirmDeleteModal.vue'
import { FilterMatchMode } from '@primevue/core/api'

const route = useRoute()
const store = useMainStore()
const { tSuccess, tError } = useCustomToast()

const loading = ref<boolean>(false)
const contracts = ref<Contract[]>([])
const rooms = ref<Room[]>([])
const totalRecords = ref<number>(0)
const first = ref(0)
const rows = ref(10)
const selectedContract = ref<Contract | null>(null)
const isDrawerOpen = ref<boolean>(false)
const propertyId = computed(() => Number(route.params.id))
const selectedProperty = ref<PropertyUI | null>(null)
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
})
const filterParams = ref<{ name?: string; status?: string }>({})
const sortBy = ref<string>('')
const contractModal = ref<InstanceType<typeof UpSertContractModal> | null>(null)
const deleteModal = ref<InstanceType<typeof ConfirmDeleteModal> | null>(null)
const editingContract = ref<Contract | null>(null)
const deletingContract = ref<Contract | null>(null)

const stats = computed(() => ({
  total: contracts.value.length,
  active: contracts.value.filter((r) => r.status === 'active').length,
  ended: contracts.value.filter((r) => r.status === 'ended').length,
  cancelled: contracts.value.filter((r) => r.status === 'cancelled').length,
}))

const onAddContract = () => {
  editingContract.value = null
  contractModal.value?.open()
}

const onEditContract = (contract: Contract) => {
  editingContract.value = contract
  contractModal.value?.open()
}

const onDeleteContract = (contract: Contract) => {
  deletingContract.value = contract
  deleteModal.value?.open()
}

const openDrawer = (contract: Contract) => {
  selectedContract.value = contract
  isDrawerOpen.value = true
}

const handleConfirmDelete = async (contract: Contract) => {
  try {
    deleteModal.value?.setLoading(true)
    await deleteContract(contract.id, propertyId.value)
    await loadContracts()
    tSuccess('Thành công', 'Xóa hợp đồng thành công')
  } catch (error: any) {
    const eMsg = error?.response?.data?.message ?? 'Xóa hợp đồng thất bại'
    tError('Lỗi', eMsg)
  } finally {
    deleteModal.value?.setLoading(false)
    deleteModal.value?.close()
  }
}

const handleCancelDelete = () => {
  deletingContract.value = null
  deleteModal.value?.close()
}

const handleContractSaved = () => {
  filterParams.value = {}
  first.value = 0
  loadContracts()
  tSuccess('Thành công', 'Thêm hợp đồng thành công')
}

const handleContractUpdated = () => {
  filterParams.value = {}
  first.value = 0
  loadContracts()
  tSuccess('Thành công', 'Cập nhật hợp đồng thành công')
}

const loadContracts = async (params: any = null) => {
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
    const data = await getContracts(propertyId.value, paramQuery)
    contracts.value = data.results
    totalRecords.value = data.totalResults
  } catch (e: any) {
    console.error(e)
    const eMsg = e?.response?.data?.message ?? 'Không thể tải danh sách hợp đồng'
    tError('Lỗi', eMsg)
    contracts.value = []
  } finally {
    loading.value = false
  }
}

const handleFilter = (filters: { name?: string; status?: string }) => {
  filterParams.value = filters
  loadContracts()
}

const handleSort = (sort: string) => {
  sortBy.value = sort
  loadRooms()
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
  await Promise.all([loadProperty(), loadContracts(), loadRooms()])
})
</script>

<style scoped></style>
