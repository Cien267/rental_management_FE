<template>
  <DefaultLayout :selected-property="selectedProperty">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="text-2xl font-semibold text-gray-900">Số đo công tơ</div>
          <div class="text-base text-gray-300">Quản lý số đo công tơ</div>
        </div>
        <Button
          label="Thêm số đo"
          icon="pi pi-plus"
          class="!bg-sky-600 border-0"
          @click="onAddUtilityMeterReading"
        />
      </div>

      <PageLoading v-if="loading" />

      <div v-else class="space-y-6">
        <!-- Table -->
        <ListUtilityMeterReadingTable
          :utilityMeterReadings="utilityMeterReadings"
          :loading="loading"
          :rooms="rooms"
          :total-records="totalRecords"
          :first="first"
          :rows="rows"
          :sort-order="sortOrder"
          :sort-field="sortField"
          :utilityMeterSettings="utilityMeterSettings"
          @open-drawer="openDrawer"
          @edit-utility-meter-reading="onEditUtilityMeterReading"
          @delete-utility-meter-reading="onDeleteUtilityMeterReading"
          @load-utility-meter-readings="loadUtilityMeterReadings"
        />
      </div>
    </div>

    <!-- Modals -->
    <UpSertUtilityMeterReadingModal
      ref="utilityMeterReadingModal"
      :property-id="propertyId"
      :rooms="rooms"
      :utilityMeterSettings="utilityMeterSettings"
      :utility-meter-reading="editingUtilityMeterReading"
      @utility-meter-reading-saved="handleUtilityMeterReadingSaved"
      @utility-meter-reading-updated="handleUtilityMeterReadingUpdated"
    />

    <ConfirmDeleteModal
      ref="deleteModal"
      :data="deletingUtilityMeterReading"
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
import UpSertUtilityMeterReadingModal from '@/components/utilityMeterReadings/UpSertUtilityMeterReadingModal.vue'
import type { UtilityMeterReading } from '@/types/utilityMeterReading'
import type { Room } from '@/types/room'
import { getRooms } from '@/services/api/roomService'
import { getUtilityMeters } from '@/services/api/utilityMeterService'
import type { Property, PropertyUI } from '@/types/property'
import { getProperty } from '@/services/api/propertyService'
import {
  getUtilityMeterReadings,
  deleteUtilityMeterReading,
} from '@/services/api/utilityMeterReadingService'
import { transformPropertyToUI } from '@/transformers/properties'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useCustomToast } from '@/composables/base/useCustomToast'
import ListUtilityMeterReadingTable from '@/components/utilityMeterReadings/ListUtilityMeterReadingTable.vue'
import ConfirmDeleteModal from '@/components/base/organisms/ConfirmDeleteModal.vue'
import type { UtilityMeter } from '@/types/utilityMeter'

const route = useRoute()
const store = useMainStore()
const { tSuccess, tError } = useCustomToast()

const loading = ref<boolean>(false)
const utilityMeterReadings = ref<UtilityMeterReading[]>([])
const rooms = ref<Room[]>([])
const utilityMeterSettings = ref<UtilityMeter[]>([])
const totalRecords = ref<number>(0)
const first = ref(0)
const rows = ref(10)
const sortOrder = ref<number | undefined>()
const sortField = ref<string>('')
const selectedUtilityMeterReading = ref<UtilityMeterReading | null>(null)
const isDrawerOpen = ref<boolean>(false)
const propertyId = computed(() => Number(route.params.id))
const selectedProperty = ref<PropertyUI | null>(null)
const filterParams = ref<{ name?: string; status?: string }>({})
const sortBy = ref<string>('')
const utilityMeterReadingModal = ref<InstanceType<typeof UpSertUtilityMeterReadingModal> | null>(
  null,
)
const deleteModal = ref<InstanceType<typeof ConfirmDeleteModal> | null>(null)
const editingUtilityMeterReading = ref<UtilityMeterReading | null>(null)
const deletingUtilityMeterReading = ref<UtilityMeterReading | null>(null)

const onAddUtilityMeterReading = () => {
  editingUtilityMeterReading.value = null
  utilityMeterReadingModal.value?.open()
}

const onEditUtilityMeterReading = (utilityMeter: UtilityMeterReading) => {
  editingUtilityMeterReading.value = utilityMeter
  utilityMeterReadingModal.value?.open()
}

const onDeleteUtilityMeterReading = (utilityMeter: UtilityMeterReading) => {
  deletingUtilityMeterReading.value = utilityMeter
  deleteModal.value?.open()
}

const openDrawer = (utilityMeter: UtilityMeterReading) => {
  selectedUtilityMeterReading.value = utilityMeter
  isDrawerOpen.value = true
}

const handleConfirmDelete = async (utilityMeter: UtilityMeterReading) => {
  try {
    deleteModal.value?.setLoading(true)
    await deleteUtilityMeterReading(utilityMeter.id, propertyId.value)
    await loadUtilityMeterReadings()
    tSuccess('Thành công', 'Xóa số đo công tơ thành công')
  } catch (error: any) {
    const eMsg = error?.response?.data?.message ?? 'Xóa số đo công tơ thất bại'
    tError('Lỗi', eMsg)
  } finally {
    deleteModal.value?.setLoading(false)
    deleteModal.value?.close()
  }
}

const handleCancelDelete = () => {
  deletingUtilityMeterReading.value = null
  deleteModal.value?.close()
}

const handleUtilityMeterReadingSaved = () => {
  filterParams.value = {}
  first.value = 0
  loadUtilityMeterReadings()
  tSuccess('Thành công', 'Thêm số đo công tơ thành công')
}

const handleUtilityMeterReadingUpdated = () => {
  filterParams.value = {}
  first.value = 0
  loadUtilityMeterReadings()
  tSuccess('Thành công', 'Cập nhật số đo công tơ thành công')
}

const loadUtilityMeterReadings = async (params: any = null) => {
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
    const data = await getUtilityMeterReadings(propertyId.value, paramQuery)
    utilityMeterReadings.value = data.results
    totalRecords.value = data.totalResults
  } catch (e: any) {
    console.error(e)
    const eMsg = e?.response?.data?.message ?? 'Không thể tải danh sách số đo công tơ'
    tError('Lỗi', eMsg)
    utilityMeterReadings.value = []
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

const loadUtilityMeterSetting = async () => {
  const paramQuery = {
    limit: 1000,
    page: 1,
  }
  if (!propertyId.value) return
  loading.value = true
  try {
    const data = await getUtilityMeters(propertyId.value, paramQuery)
    utilityMeterSettings.value = data.results
  } catch (e: any) {
    const eMsg = e?.response?.data?.message ?? 'Không thể tải danh sách cài đặt công tơ'
    tError('Lỗi', eMsg)
    utilityMeterSettings.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    loadProperty(),
    loadUtilityMeterReadings(),
    loadRooms(),
    loadUtilityMeterSetting(),
  ])
})
</script>

<style scoped></style>
