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
        <div class="bg-white rounded-2xl border border-gray-200">
          <div class="overflow-x-auto">
            <DataTable
              ref="dt"
              stripedRows
              paginator
              removableSort
              dataKey="id"
              filterDisplay="row"
              :rows="15"
              :rowsPerPageOptions="[5, 10, 15, 20, 50]"
              :value="filteredRooms"
              :globalFilterFields="['name', 'status']"
              :loading="loading"
              tableStyle="min-width: 50rem"
              selectionMode="single"
              :metaKeySelection="false"
              v-model:filters="filters"
              v-model:selection="selectedRooms"
              exportFilename="Phòng trọ"
              @rowSelect="openDrawer"
            >
              <template #empty> Chưa có phòng nào </template>
              <template #loading> Đang tải dữ liệu </template>
              <template #header>
                <div class="text-end pb-4">
                  <Button icon="pi pi-external-link" label="Export" @click="exportCSV" />
                </div>
              </template>
              <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
              <Column field="name" header="Tên" sortable>
                <template #body="{ data }">
                  {{ data.name }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <InputText
                    v-model="filterModel.value"
                    type="text"
                    @input="filterCallback()"
                    placeholder="Tìm theo tên"
                  />
                </template>
              </Column>
              <Column field="floor" header="Tầng" sortable></Column>
              <Column field="price" header="Giá" sortable></Column>
              <Column field="status" header="Trạng thái">
                <template #body="slotProps">
                  <Tag
                    :value="getRoomStatusValue(slotProps.data.status)"
                    :severity="getRoomStatusSeverity(slotProps.data.status)"
                  />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <Select
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="statusOptions"
                    placeholder="Chon trạng thái"
                    style="min-width: 12rem"
                    :showClear="true"
                  >
                    <template #option="slotProps">
                      <Tag
                        :value="getRoomStatusValue(slotProps.option)"
                        :severity="getRoomStatusSeverity(slotProps.option)"
                      />
                    </template>
                  </Select>
                </template>
              </Column>
              <Column field="maxOccupants" header="Số người thuê tối đa"></Column>
              <Column field="" header="Hành động">
                <template #body="slotProps">
                  <Button
                    label="Sửa"
                    size="small"
                    severity="secondary"
                    class="mr-2"
                    @click.stop="onEditRoom(slotProps.data)"
                  />
                  <Button
                    label="Xóa"
                    size="small"
                    severity="danger"
                    @click.stop="onDeleteRoom(slotProps.data)"
                  />
                </template>
              </Column>
            </DataTable>
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
import Select from 'primevue/select'
import Drawer from 'primevue/drawer'
import InputText from 'primevue/inputtext'
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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { FilterMatchMode } from '@primevue/core/api'

const route = useRoute()
const store = useMainStore()

const loading = ref<boolean>(false)
const rooms = ref<Room[]>([])
const selectedRooms = ref<Room[]>([])
const keyword = ref<string>('')
const selectedRoom = ref<Room | null>(null)
const isDrawerOpen = ref<boolean>(false)
const propertyId = computed(() => Number(route.params.id))
const selectedProperty = ref<PropertyUI | null>(null)

const roomModal = ref<InstanceType<typeof UpSertRoomModal> | null>(null)
const deleteModal = ref<InstanceType<typeof DeleteRoomModal> | null>(null)
const editingRoom = ref<Room | null>(null)
const deletingRoom = ref<Room | null>(null)
const dt = ref()

const exportCSV = () => {
  dt.value.exportCSV()
}

const stats = computed(() => ({
  total: rooms.value.length,
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

const statusOptions = ref(['available', 'occupied', 'maintenance'])

const getRoomStatusValue = (status: string) => {
  if (status === 'available') return 'Còn trống'
  if (status === 'occupied') return 'Đã thuê'
  return 'Bảo trì'
}

const getRoomStatusSeverity = (status: string) => {
  if (status === 'available') return 'info'
  if (status === 'occupied') return 'success'
  return 'warn'
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
})

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
    rooms.value = [
      {
        id: 1,
        propertyId: 1,
        name: 'Phòng 101',
        floor: 1,
        area: 20,
        price: 5000000,
        status: 'available',
        amenities: ['Điều hòa', 'Tủ lạnh'],
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
        amenities: ['Điều hòa', 'Tủ lạnh'],
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
        amenities: ['Điều hòa', 'Tủ lạnh'],
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
