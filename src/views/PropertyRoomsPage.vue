<template>
  <DefaultLayout :selected-property="selectedProperty">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="text-2xl font-semibold text-gray-900">Phòng</div>
          <div class="text-base text-gray-300">Quản lý phòng và trạng thái</div>
        </div>
        <Button
          label="Thêm phòng"
          icon="pi pi-plus"
          class="!bg-sky-600 border-0"
          @click="onAddRoom"
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
                <Tag severity="success" value="Đã thuê"></Tag>
                <p class="text-4xl font-bold text-green-600">{{ stats.occupied }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <Tag severity="info" value="Còn trống"></Tag>
                <p class="text-4xl font-bold text-blue-600">{{ stats.available }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <Tag severity="warn" value="Bảo trì"></Tag>
                <p class="text-4xl font-bold text-orange-600">{{ stats.maintenance }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <ListRoomTable
          :rooms="rooms"
          :loading="loading"
          :total-records="totalRecords"
          :first="first"
          :rows="rows"
          v-model:filters="filters"
          @open-drawer="openDrawer"
          @edit-room="onEditRoom"
          @delete-room="onDeleteRoom"
          @load-rooms="loadRooms"
          @filter="handleFilter"
          @sort="handleSort"
        />
      </div>
    </div>

    <!-- Drawer: room details -->
    <DetailRoomDrawer v-model:visible="isDrawerOpen" :selected-room="selectedRoom" />
    <!-- Modals -->
    <UpSertRoomModal
      ref="roomModal"
      :property-id="propertyId"
      :room="editingRoom"
      @room-saved="handleRoomSaved"
      @room-updated="handleRoomUpdated"
    />

    <ConfirmDeleteModal
      ref="deleteModal"
      :data="deletingRoom"
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
import UpSertRoomModal from '@/components/rooms/UpSertRoomModal.vue'
import type { Room } from '@/types/room'
import type { Property, PropertyUI } from '@/types/property'
import { getProperty } from '@/services/api/propertyService'
import { getRooms, deleteRoom } from '@/services/api/roomService'
import { transformPropertyToUI } from '@/transformers/properties'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useCustomToast } from '@/composables/base/useCustomToast'
import DetailRoomDrawer from '@/components/rooms/DetailRoomDrawer.vue'
import ListRoomTable from '@/components/rooms/ListRoomTable.vue'
import ConfirmDeleteModal from '@/components/base/organisms/ConfirmDeleteModal.vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useRouter } from 'vue-router'
const router = useRouter()

const route = useRoute()
const store = useMainStore()
const { tSuccess, tError } = useCustomToast()

const loading = ref<boolean>(false)
const rooms = ref<Room[]>([])
const totalRecords = ref<number>(0)
const first = ref(0)
const rows = ref(10)
const selectedRoom = ref<Room | null>(null)
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
const roomModal = ref<InstanceType<typeof UpSertRoomModal> | null>(null)
const deleteModal = ref<InstanceType<typeof ConfirmDeleteModal> | null>(null)
const editingRoom = ref<Room | null>(null)
const deletingRoom = ref<Room | null>(null)

const stats = computed(() => ({
  total: rooms.value.length,
  available: rooms.value.filter((r) => r.status === 'available').length,
  occupied: rooms.value.filter((r) => r.status === 'occupied').length,
  maintenance: rooms.value.filter((r) => r.status === 'maintenance').length,
}))

const onAddRoom = () => {
  editingRoom.value = null
  roomModal.value?.open()
}

const onEditRoom = (room: Room) => {
  editingRoom.value = room
  roomModal.value?.open()
}

const onDeleteRoom = (room: Room) => {
  deletingRoom.value = room
  deleteModal.value?.open()
}

const openDrawer = (room: Room) => {
  selectedRoom.value = room
  isDrawerOpen.value = true
}

const handleConfirmDelete = async (room: Room) => {
  try {
    deleteModal.value?.setLoading(true)
    await deleteRoom(room.id, propertyId.value)
    await loadRooms()
    tSuccess('Thành công', 'Xóa phòng thành công')
  } catch (error: any) {
    const eMsg = error?.response?.data?.message ?? 'Xóa phòng thất bại'
    tError('Lỗi', eMsg)
  } finally {
    deleteModal.value?.setLoading(false)
    deleteModal.value?.close()
  }
}

const handleCancelDelete = () => {
  deletingRoom.value = null
  deleteModal.value?.close()
}

const handleRoomSaved = () => {
  filterParams.value = {}
  first.value = 0
  loadRooms()
  tSuccess('Thành công', 'Thêm phòng thành công')
}

const handleRoomUpdated = () => {
  filterParams.value = {}
  first.value = 0
  loadRooms()
  tSuccess('Thành công', 'Cập nhật phòng thành công')
}

const loadRooms = async (params: any = null) => {
  const paramQuery = {
    limit: 10,
    page: 1,
    sortBy: sortBy.value,
    ...filterParams.value,
  }
  if (params) {
    paramQuery.limit = params.rows
    paramQuery.page = params.page + 1
    first.value = params.first
    rows.value = params.rows
  }
  if (!propertyId.value) return
  loading.value = true
  try {
    const data = await getRooms(propertyId.value, paramQuery)
    rooms.value = data.results
    totalRecords.value = data.totalResults
  } catch (e: any) {
    console.error(e)
    const eMsg = e?.response?.data?.message ?? 'Không thể tải danh sách phòng'
    tError('Lỗi', eMsg)
    rooms.value = []
  } finally {
    loading.value = false
  }
}

const handleFilter = (filters: { name?: string; status?: string }) => {
  filterParams.value = filters
  loadRooms()
}

const handleSort = (sort: string) => {
  sortBy.value = sort
  loadRooms()
}

const loadProperty = async () => {
  try {
    const prop: Property = await getProperty(propertyId.value)
    const ui = transformPropertyToUI(prop, 0, 0)
    selectedProperty.value = ui
    store.setSelectedProperty(prop)
  } catch {
    selectedProperty.value = null
    store.setSelectedProperty(null)
  }
}

onMounted(async () => {
  await Promise.all([loadProperty(), loadRooms()])

  // open detail drawer if navigating from an other page's selection
  setTimeout(() => {
    const roomId = router.options.history.state.roomId
    if (roomId) {
      const targetRoom = rooms.value.find((te) => te.id === roomId)
      if (targetRoom) openDrawer(targetRoom)
    }
  }, 100)
})
</script>

<style scoped></style>
