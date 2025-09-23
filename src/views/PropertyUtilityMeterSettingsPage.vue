<template>
  <DefaultLayout :selected-property="selectedProperty">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="text-2xl font-semibold text-gray-900">Cài đặt công tơ</div>
          <div class="text-base text-gray-300">Quản lý công tơ</div>
        </div>
        <Button
          label="Thêm công cơ"
          icon="pi pi-plus"
          class="!bg-sky-600 border-0"
          @click="onAddUtilityMeter"
        />
      </div>

      <PageLoading v-if="loading" />

      <div v-else class="space-y-6">
        <!-- Table -->
        <ListUtilityMeterTable
          :utilityMeters="utilityMeters"
          :loading="loading"
          :total-records="totalRecords"
          :first="first"
          :rows="rows"
          :sort-order="sortOrder"
          :sort-field="sortField"
          v-model:filters="filters"
          @open-drawer="openDrawer"
          @edit-utility-meter="onEditUtilityMeter"
          @delete-utility-meter="onDeleteUtilityMeter"
          @load-utility-meters="loadUtilityMeters"
          @filter="handleFilter"
          @sort="handleSort"
        />
      </div>
    </div>

    <!-- Drawer: utilityMeter details -->
    <DetailUtilityMeterDrawer
      v-model:visible="isDrawerOpen"
      :selected-utility-meter="selectedUtilityMeter"
    />
    <!-- Modals -->
    <UpSertUtilityMeterModal
      ref="utilityMeterModal"
      :property-id="propertyId"
      :rooms="rooms"
      :utility-meter="editingUtilityMeter"
      @utility-meter-saved="handleUtilityMeterSaved"
      @utility-meter-updated="handleUtilityMeterUpdated"
    />

    <ConfirmDeleteModal
      ref="deleteModal"
      :data="deletingUtilityMeter"
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
import UpSertUtilityMeterModal from '@/components/utilityMeters/UpSertUtilityMeterModal.vue'
import type { UtilityMeter } from '@/types/utilityMeter'
import type { Room } from '@/types/room'
import { getRooms } from '@/services/api/roomService'
import type { Property, PropertyUI } from '@/types/property'
import { getProperty } from '@/services/api/propertyService'
import { getUtilityMeters, deleteUtilityMeter } from '@/services/api/utilityMeterService'
import { transformPropertyToUI } from '@/transformers/properties'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useCustomToast } from '@/composables/base/useCustomToast'
import DetailUtilityMeterDrawer from '@/components/utilityMeters/DetailUtilityMeterDrawer.vue'
import ListUtilityMeterTable from '@/components/utilityMeters/ListUtilityMeterTable.vue'
import ConfirmDeleteModal from '@/components/base/organisms/ConfirmDeleteModal.vue'
import { FilterMatchMode } from '@primevue/core/api'

const route = useRoute()
const store = useMainStore()
const { tSuccess, tError } = useCustomToast()

const loading = ref<boolean>(false)
const utilityMeters = ref<UtilityMeter[]>([])
const rooms = ref<Room[]>([])
const totalRecords = ref<number>(0)
const first = ref(0)
const rows = ref(10)
const sortOrder = ref<number | undefined>()
const sortField = ref<string>('')
const selectedUtilityMeter = ref<UtilityMeter | null>(null)
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
const utilityMeterModal = ref<InstanceType<typeof UpSertUtilityMeterModal> | null>(null)
const deleteModal = ref<InstanceType<typeof ConfirmDeleteModal> | null>(null)
const editingUtilityMeter = ref<UtilityMeter | null>(null)
const deletingUtilityMeter = ref<UtilityMeter | null>(null)

const onAddUtilityMeter = () => {
  editingUtilityMeter.value = null
  utilityMeterModal.value?.open()
}

const onEditUtilityMeter = (utilityMeter: UtilityMeter) => {
  editingUtilityMeter.value = utilityMeter
  utilityMeterModal.value?.open()
}

const onDeleteUtilityMeter = (utilityMeter: UtilityMeter) => {
  deletingUtilityMeter.value = utilityMeter
  deleteModal.value?.open()
}

const openDrawer = (utilityMeter: UtilityMeter) => {
  selectedUtilityMeter.value = utilityMeter
  isDrawerOpen.value = true
}

const handleConfirmDelete = async (utilityMeter: UtilityMeter) => {
  try {
    deleteModal.value?.setLoading(true)
    await deleteUtilityMeter(utilityMeter.id, propertyId.value)
    await loadUtilityMeters()
    tSuccess('Thành công', 'Xóa công tơ thành công')
  } catch (error: any) {
    const eMsg = error?.response?.data?.message ?? 'Xóa công tơ thất bại'
    tError('Lỗi', eMsg)
  } finally {
    deleteModal.value?.setLoading(false)
    deleteModal.value?.close()
  }
}

const handleCancelDelete = () => {
  deletingUtilityMeter.value = null
  deleteModal.value?.close()
}

const handleUtilityMeterSaved = () => {
  filterParams.value = {}
  first.value = 0
  loadUtilityMeters()
  tSuccess('Thành công', 'Thêm công tơ thành công')
}

const handleUtilityMeterUpdated = () => {
  filterParams.value = {}
  first.value = 0
  loadUtilityMeters()
  tSuccess('Thành công', 'Cập nhật công tơ thành công')
}

const loadUtilityMeters = async (params: any = null) => {
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
    const data = await getUtilityMeters(propertyId.value, paramQuery)
    utilityMeters.value = data.results
    totalRecords.value = data.totalResults
  } catch (e: any) {
    console.error(e)
    const eMsg = e?.response?.data?.message ?? 'Không thể tải danh sách công tơ'
    tError('Lỗi', eMsg)
    utilityMeters.value = []
  } finally {
    loading.value = false
  }
}

const handleFilter = (filters: { name?: string; status?: string }) => {
  filterParams.value = filters
  loadUtilityMeters()
}

const handleSort = (event: any) => {
  let sortByStr = ''
  if (event.sortField && event.sortOrder) {
    sortField.value = event.sortField
    sortOrder.value = event.sortOrder
    sortByStr = `${event.sortField}:${event.sortOrder === 1 ? 'asc' : 'desc'}`
  } else {
    sortField.value = ''
    sortOrder.value = undefined
  }
  sortBy.value = sortByStr
  loadUtilityMeters()
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
  await Promise.all([loadProperty(), loadUtilityMeters(), loadRooms()])
})
</script>

<style scoped></style>
