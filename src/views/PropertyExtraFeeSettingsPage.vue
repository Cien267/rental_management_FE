<template>
  <DefaultLayout :selected-property="selectedProperty">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="text-2xl font-semibold text-gray-900">Cài đặt phí dịch vụ khác</div>
          <div class="text-base text-gray-300">Quản lý phí dịch vụ và trạng thái</div>
        </div>
        <Button
          label="Thêm loại phí"
          icon="pi pi-plus"
          class="!bg-sky-600 border-0"
          @click="onAddExtraFee"
        />
      </div>

      <PageLoading v-if="loading" />

      <div v-else class="space-y-6">
        <!-- Table -->
        <ListExtraFeeTable
          :extraFees="extraFees"
          :loading="loading"
          :total-records="totalRecords"
          :first="first"
          :rows="rows"
          :sort-order="sortOrder"
          :sort-field="sortField"
          v-model:filters="filters"
          @open-drawer="openDrawer"
          @edit-extra-fee="onEditExtraFee"
          @delete-extra-fee="onDeleteExtraFee"
          @load-extra-fees="loadExtraFees"
          @filter="handleFilter"
          @sort="handleSort"
        />
      </div>
    </div>

    <!-- Drawer: extraFee details -->
    <DetailExtraFeeDrawer v-model:visible="isDrawerOpen" :selected-extra-fee="selectedExtraFee" />
    <!-- Modals -->
    <UpSertExtraFeeModal
      ref="extraFeeModal"
      :property-id="propertyId"
      :extra-fee="editingExtraFee"
      @extra-fee-saved="handleExtraFeeSaved"
      @extra-fee-updated="handleExtraFeeUpdated"
    />

    <ConfirmDeleteModal
      ref="deleteModal"
      :data="deletingExtraFee"
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
import UpSertExtraFeeModal from '@/components/extraFees/UpSertExtraFeeModal.vue'
import type { ExtraFee } from '@/types/extraFee'
import type { Property, PropertyUI } from '@/types/property'
import { getProperty } from '@/services/api/propertyService'
import { getExtraFees, deleteExtraFee } from '@/services/api/extraFeeService'
import { transformPropertyToUI } from '@/transformers/properties'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useCustomToast } from '@/composables/base/useCustomToast'
import DetailExtraFeeDrawer from '@/components/extraFees/DetailExtraFeeDrawer.vue'
import ListExtraFeeTable from '@/components/extraFees/ListExtraFeeTable.vue'
import ConfirmDeleteModal from '@/components/base/organisms/ConfirmDeleteModal.vue'
import { FilterMatchMode } from '@primevue/core/api'

const route = useRoute()
const store = useMainStore()
const { tSuccess, tError } = useCustomToast()

const loading = ref<boolean>(false)
const extraFees = ref<ExtraFee[]>([])
const totalRecords = ref<number>(0)
const first = ref(0)
const rows = ref(10)
const sortOrder = ref<number | undefined>()
const sortField = ref<string>('')
const selectedExtraFee = ref<ExtraFee | null>(null)
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
const extraFeeModal = ref<InstanceType<typeof UpSertExtraFeeModal> | null>(null)
const deleteModal = ref<InstanceType<typeof ConfirmDeleteModal> | null>(null)
const editingExtraFee = ref<ExtraFee | null>(null)
const deletingExtraFee = ref<ExtraFee | null>(null)

const onAddExtraFee = () => {
  editingExtraFee.value = null
  extraFeeModal.value?.open()
}

const onEditExtraFee = (extraFee: ExtraFee) => {
  editingExtraFee.value = extraFee
  extraFeeModal.value?.open()
}

const onDeleteExtraFee = (extraFee: ExtraFee) => {
  deletingExtraFee.value = extraFee
  deleteModal.value?.open()
}

const openDrawer = (extraFee: ExtraFee) => {
  selectedExtraFee.value = extraFee
  isDrawerOpen.value = true
}

const handleConfirmDelete = async (extraFee: ExtraFee) => {
  try {
    deleteModal.value?.setLoading(true)
    await deleteExtraFee(extraFee.id, propertyId.value)
    await loadExtraFees()
    tSuccess('Thành công', 'Xóa phí dịch vụ khác thành công')
  } catch (error: any) {
    const eMsg = error?.response?.data?.message ?? 'Xóa phí dịch vụ khác thất bại'
    tError('Lỗi', eMsg)
  } finally {
    deleteModal.value?.setLoading(false)
    deleteModal.value?.close()
  }
}

const handleCancelDelete = () => {
  deletingExtraFee.value = null
  deleteModal.value?.close()
}

const handleExtraFeeSaved = () => {
  filterParams.value = {}
  first.value = 0
  loadExtraFees()
  tSuccess('Thành công', 'Thêm phí dịch vụ khác thành công')
}

const handleExtraFeeUpdated = () => {
  filterParams.value = {}
  first.value = 0
  loadExtraFees()
  tSuccess('Thành công', 'Cập nhật phí dịch vụ khác thành công')
}

const loadExtraFees = async (params: any = null) => {
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
    const data = await getExtraFees(propertyId.value, paramQuery)
    extraFees.value = data.results
    totalRecords.value = data.totalResults
  } catch (e: any) {
    console.error(e)
    const eMsg = e?.response?.data?.message ?? 'Không thể tải danh sách phí dịch vụ khác'
    tError('Lỗi', eMsg)
    extraFees.value = []
  } finally {
    loading.value = false
  }
}

const handleFilter = (filters: { name?: string; status?: string }) => {
  filterParams.value = filters
  loadExtraFees()
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
  loadExtraFees()
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

onMounted(async () => {
  await Promise.all([loadProperty(), loadExtraFees()])
})
</script>

<style scoped></style>
