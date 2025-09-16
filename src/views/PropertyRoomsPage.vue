<template>
  <DefaultLayout :selected-property="selectedProperty">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Phòng</h1>
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-lg font-semibold text-gray-600">Còn trống</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.available }}</p>
              </div>
              <span class="px-3 py-1 text-sm rounded bg-green-100 text-green-700">Available</span>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-lg font-semibold text-gray-600">Đã thuê</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.occupied }}</p>
              </div>
              <span class="px-3 py-1 text-sm rounded bg-sky-100 text-sky-700">Occupied</span>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-lg font-semibold text-gray-600">Bảo trì</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.maintenance }}</p>
              </div>
              <span class="px-3 py-1 text-sm rounded bg-amber-100 text-amber-700">Maintenance</span>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-2xl border border-gray-200">
          <div class="p-4 flex items-center justify-between border-b border-gray-200">
            <div class="text-base font-semibold text-gray-800">Danh sách phòng</div>
            <div class="relative">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                v-model="keyword"
                type="text"
                class="pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Tìm kiếm phòng..."
              />
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tên phòng
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tầng
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Diện tích
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Giá
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Số người
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="room in filteredRooms"
                  :key="room.id"
                  class="hover:bg-gray-50 cursor-pointer"
                  @click="openDrawer(room)"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ room.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ room.floor ?? '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ room.area ? room.area + ' m²' : '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatCurrency(room.price) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Tag
                      :value="statusLabel(room.status)"
                      :severity="statusSeverity(room.status)"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ room.currentOccupants }}/{{ room.maxOccupants }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Button
                      label="Sửa"
                      size="small"
                      severity="secondary"
                      class="mr-2"
                      @click.stop="onEditRoom(room)"
                    />
                    <Button
                      label="Xóa"
                      size="small"
                      severity="danger"
                      @click.stop="onDeleteRoom(room)"
                    />
                  </td>
                </tr>
                <tr v-if="filteredRooms.length === 0">
                  <td colspan="7" class="px-6 py-8 text-center text-sm text-gray-400">
                    Không có phòng nào
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer: room details -->
    <Drawer
      v-model:visible="isDrawerOpen"
      header="Chi tiết phòng"
      position="right"
      class="!w-full md:!w-96"
    >
      <div v-if="selectedRoom" class="p-4 space-y-3 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-500">Tên phòng</span
          ><span class="font-medium">{{ selectedRoom.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Tầng</span
          ><span class="font-medium">{{ selectedRoom.floor ?? '-' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Diện tích</span
          ><span class="font-medium">{{
            selectedRoom.area ? selectedRoom.area + ' m²' : '-'
          }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Giá</span
          ><span class="font-medium">{{ formatCurrency(selectedRoom.price) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Trạng thái</span
          ><Tag
            :value="statusLabel(selectedRoom.status)"
            :severity="statusSeverity(selectedRoom.status)"
          />
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Số người</span
          ><span class="font-medium"
            >{{ selectedRoom.currentOccupants }}/{{ selectedRoom.maxOccupants }}</span
          >
        </div>
        <div>
          <div class="text-gray-500">Tiện nghi</div>
          <div class="mt-1 text-gray-700">{{ selectedRoom.amenities?.join(', ') || '-' }}</div>
        </div>
        <div>
          <div class="text-gray-500">Ghi chú</div>
          <div class="mt-1 text-gray-700">{{ selectedRoom.note || '-' }}</div>
        </div>
      </div>
    </Drawer>

    <!-- Modals -->
    <UpSertRoomModal
      ref="roomModal"
      :property-id="propertyId"
      :room="editingRoom"
      @room-saved="handleRoomSaved"
      @room-updated="handleRoomUpdated"
    />
    <DeleteRoomModal
      ref="deleteModal"
      :room="deletingRoom"
      @confirm-delete="handleConfirmDelete"
      @cancel-delete="handleCancelDelete"
    />
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Drawer from 'primevue/drawer'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageLoading from '@/components/base/atoms/PageLoading.vue'
import UpSertRoomModal from '@/components/rooms/UpSertRoomModal.vue'
import DeleteRoomModal from '@/components/rooms/DeleteRoomModal.vue'
import type { Room } from '@/types/room'
import type { Property, PropertyUI } from '@/types/property'
import { getProperty } from '@/services/api/propertyService'
import { getRooms, deleteRoom } from '@/services/api/roomService'
import { transformPropertyToUI } from '@/transformers/properties'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'

const route = useRoute()
const store = useMainStore()

const loading = ref<boolean>(false)
const rooms = ref<Room[]>([])
const keyword = ref<string>('')
const selectedRoom = ref<Room | null>(null)
const isDrawerOpen = ref<boolean>(false)
const propertyId = computed(() => Number(route.params.id))
const selectedProperty = ref<PropertyUI | null>(null)

const roomModal = ref<InstanceType<typeof UpSertRoomModal> | null>(null)
const deleteModal = ref<InstanceType<typeof DeleteRoomModal> | null>(null)
const editingRoom = ref<Room | null>(null)
const deletingRoom = ref<Room | null>(null)

const stats = computed(() => ({
  available: rooms.value.filter((r) => r.status === 'available').length,
  occupied: rooms.value.filter((r) => r.status === 'occupied').length,
  maintenance: rooms.value.filter((r) => r.status === 'maintenance').length,
}))

const filteredRooms = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return rooms.value
  return rooms.value.filter((r) => r.name.toLowerCase().includes(q))
})

function statusLabel(status: Room['status']): string {
  if (status === 'available') return 'Còn trống'
  if (status === 'occupied') return 'Đã thuê'
  return 'Bảo trì'
}

function statusSeverity(status: Room['status']): 'success' | 'info' | 'warn' {
  if (status === 'available') return 'success'
  if (status === 'occupied') return 'info'
  return 'warn'
}

function formatCurrency(v: number): string {
  return Number(v || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

function onAddRoom() {
  editingRoom.value = null
  roomModal.value?.open()
}

function onEditRoom(room: Room) {
  editingRoom.value = room
  roomModal.value?.open()
}

function onDeleteRoom(room: Room) {
  deletingRoom.value = room
  deleteModal.value?.open()
}

function openDrawer(room: Room) {
  selectedRoom.value = room
  isDrawerOpen.value = true
}

async function handleConfirmDelete(room: Room) {
  try {
    deleteModal.value?.setLoading(true)
    await deleteRoom(room.id)
    await loadRooms()
    deleteModal.value?.close()
  } catch (error) {
    console.error('Delete room error:', error)
  } finally {
    deleteModal.value?.setLoading(false)
  }
}

function handleCancelDelete() {
  deletingRoom.value = null
  deleteModal.value?.close()
}

function handleRoomSaved() {
  loadRooms()
}

function handleRoomUpdated() {
  loadRooms()
}

async function loadRooms() {
  if (!propertyId.value) return
  loading.value = true
  try {
    const data = await getRooms(propertyId.value)
    rooms.value = data
  } catch (e) {
    console.error('Load rooms error:', e)
    rooms.value = []
  } finally {
    loading.value = false
  }
}

async function loadProperty() {
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
