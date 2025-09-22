<template>
  <DefaultLayout :selected-property="selectedProperty">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="text-2xl font-semibold text-gray-900">Người thuê</div>
          <div class="text-base text-gray-300">Quản lý người thuê và trạng thái</div>
        </div>
        <Button
          label="Thêm người thuê"
          icon="pi pi-plus"
          class="!bg-sky-600 border-0"
          @click="onAddTenant"
        />
      </div>

      <PageLoading v-if="loading" />

      <div v-else class="space-y-6">
        <!-- Stat cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <Tag icon="pi pi-users" severity="secondary" value="Tất cả"></Tag>
                <p class="text-4xl font-bold text-orange-600">{{ stats.total }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <Tag icon="pi pi-mars" severity="info" value="Nam"></Tag>
                <p class="text-4xl font-bold text-gray-600">{{ stats.males }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <Tag icon="pi pi-venus" severity="danger" value="Nữ"></Tag>
                <p class="text-4xl font-bold text-green-600">{{ stats.females }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <Tag icon="pi pi-slack" severity="warn" value="Giới tính khác"></Tag>
                <p class="text-4xl font-bold text-blue-600">{{ stats.others }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <ListTenantTable
          :tenants="tenants"
          :loading="loading"
          :total-records="totalRecords"
          :first="first"
          :rows="rows"
          v-model:filters="filters"
          :rooms="rooms"
          @open-drawer="openDrawer"
          @edit-tenant="onEditTenant"
          @delete-tenant="onDeleteTenant"
          @load-tenants="loadTenants"
          @filter="handleFilter"
          @sort="handleSort"
        />
      </div>
    </div>

    <!-- Drawer: tenant details -->
    <DetailTenantDrawer v-model:visible="isDrawerOpen" :selected-tenant="selectedTenant" />
    <!-- Modals -->
    <UpSertTenantModal
      ref="tenantModal"
      :property-id="propertyId"
      :tenant="editingTenant"
      :rooms="rooms"
      @tenant-saved="handleTenantSaved"
      @tenant-updated="handleTenantUpdated"
    />

    <ConfirmDeleteModal
      ref="deleteModal"
      :data="deletingTenant"
      nameKey="fullName"
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
import UpSertTenantModal from '@/components/tenants/UpSertTenantModal.vue'
import type { Tenant } from '@/types/tenant'
import type { Room } from '@/types/room'
import type { Property, PropertyUI } from '@/types/property'
import { getProperty } from '@/services/api/propertyService'
import { getTenants, deleteTenant } from '@/services/api/tenantService'
import { transformPropertyToUI } from '@/transformers/properties'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useCustomToast } from '@/composables/base/useCustomToast'
import DetailTenantDrawer from '@/components/tenants/DetailTenantDrawer.vue'
import ListTenantTable from '@/components/tenants/ListTenantTable.vue'
import ConfirmDeleteModal from '@/components/base/organisms/ConfirmDeleteModal.vue'
import { getRooms } from '@/services/api/roomService'
import { FilterMatchMode } from '@primevue/core/api'
import { useRouter } from 'vue-router'
const router = useRouter()

const route = useRoute()
const store = useMainStore()
const { tSuccess, tError } = useCustomToast()

const loading = ref<boolean>(false)
const tenants = ref<Tenant[]>([])
const rooms = ref<Room[]>([])
const totalRecords = ref<number>(0)
const first = ref(0)
const rows = ref(10)
const selectedTenant = ref<Tenant | null>(null)
const isDrawerOpen = ref<boolean>(false)
const propertyId = computed(() => Number(route.params.id))
const selectedProperty = ref<PropertyUI | null>(null)
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  fullName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  phone: { value: null, matchMode: FilterMatchMode.CONTAINS },
  gender: { value: null, matchMode: FilterMatchMode.EQUALS },
})
const tenantModal = ref<InstanceType<typeof UpSertTenantModal> | null>(null)
const deleteModal = ref<InstanceType<typeof ConfirmDeleteModal> | null>(null)
const editingTenant = ref<Tenant | null>(null)
const deletingTenant = ref<Tenant | null>(null)
const filterParams = ref<{ fullName?: string; phone?: string; gender?: string }>({})
const sortBy = ref<string>('')

const stats = computed(() => ({
  total: tenants.value.length,
  males: tenants.value.filter((r) => r.gender === 'male').length,
  females: tenants.value.filter((r) => r.gender === 'female').length,
  others: tenants.value.filter((r) => r.gender === 'other').length,
}))

const onAddTenant = () => {
  editingTenant.value = null
  tenantModal.value?.open()
}

const onEditTenant = (tenant: Tenant) => {
  editingTenant.value = tenant
  tenantModal.value?.open()
}

const onDeleteTenant = (tenant: Tenant) => {
  deletingTenant.value = tenant
  deleteModal.value?.open()
}

const openDrawer = (tenant: Tenant) => {
  selectedTenant.value = tenant
  isDrawerOpen.value = true
}

const handleConfirmDelete = async (tenant: Tenant) => {
  try {
    deleteModal.value?.setLoading(true)
    await deleteTenant(tenant.id, propertyId.value)
    await loadTenants()
    tSuccess('Thành công', 'Xóa người thuê thành công')
  } catch (error: any) {
    const eMsg = error?.response?.data?.message ?? 'Xóa người thuê thất bại'
    tError('Lỗi', eMsg)
  } finally {
    deleteModal.value?.setLoading(false)
    deleteModal.value?.close()
  }
}

const handleCancelDelete = () => {
  deletingTenant.value = null
  deleteModal.value?.close()
}

const handleTenantSaved = () => {
  loadTenants()
  tSuccess('Thành công', 'Thêm người thuê thành công')
}

const handleTenantUpdated = () => {
  loadTenants()
  tSuccess('Thành công', 'Cập nhật người thuê thành công')
}

const handleFilter = (filters: { fullName?: string; phone?: string; gender?: string }) => {
  filterParams.value = filters
  loadTenants()
}

const handleSort = (sort: string) => {
  sortBy.value = sort
  loadRooms()
}

const loadTenants = async (params: any = null) => {
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
    const data = await getTenants(propertyId.value, paramQuery)
    tenants.value = data.results
    totalRecords.value = data.totalResults
  } catch (e: any) {
    console.error(e)
    const eMsg = e?.response?.data?.message ?? 'Không thể tải danh sách người thuê'
    tError('Lỗi', eMsg)
    tenants.value = []
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
  await Promise.all([loadProperty(), loadTenants(), loadRooms()])

  // open detail drawer if navigating from an other page's selection
  setTimeout(() => {
    const tenantId = router.options.history.state.tenantId
    if (tenantId) {
      const targetTenant = tenants.value.find((te) => te.id === tenantId)
      if (targetTenant) openDrawer(targetTenant)
    }
  }, 100)
})
</script>

<style scoped></style>
