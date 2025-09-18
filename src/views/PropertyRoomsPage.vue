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
          @open-drawer="openDrawer"
          @edit-room="onEditRoom"
          @delete-room="onDeleteRoom"
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

const route = useRoute()
const store = useMainStore()
const { tSuccess, tError } = useCustomToast()

const loading = ref<boolean>(false)
const rooms = ref<Room[]>([])
const selectedRoom = ref<Room | null>(null)
const isDrawerOpen = ref<boolean>(false)
const propertyId = computed(() => Number(route.params.id))
const selectedProperty = ref<PropertyUI | null>(null)

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
  loadRooms()
  tSuccess('Thành công', 'Thêm phòng thành công')
}

const handleRoomUpdated = () => {
  loadRooms()
  tSuccess('Thành công', 'Cập nhật phòng thành công')
}

const loadRooms = async () => {
  if (!propertyId.value) return
  loading.value = true
  try {
    const data = await getRooms(propertyId.value)
    rooms.value = data
  } catch (e: any) {
    const eMsg = e?.response?.data?.message ?? 'Không thể tải danh sách phòng'
    tError('Lỗi', eMsg)
    rooms.value = [
      {
        id: 1,
        propertyId: 1,
        name: 'Phòng 101',
        floor: 1,
        area: 20,
        price: 5000000,
        status: 'available',
        amenities: 'Điều hòa, Tủ lạnh',
        maxOccupants: 3,
        currentOccupants: 3,
        note: 'Phòng có ban công',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        propertyId: 1,
        name: 'Phòng 102',
        floor: 1,
        area: 25,
        price: 4000000,
        status: 'occupied',
        amenities: 'Điều hòa, Tủ lạnh',
        maxOccupants: 3,
        currentOccupants: 3,
        note: 'Phòng có ban công',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        propertyId: 1,
        name: 'Phòng 203',
        floor: 2,
        area: 25,
        price: 3500000,
        status: 'occupied',
        amenities: 'Điều hòa, Tủ lạnh',
        maxOccupants: 3,
        currentOccupants: 3,
        note: 'Phòng có ban công',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  } finally {
    loading.value = false
  }
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
})
</script>

<style scoped></style>
