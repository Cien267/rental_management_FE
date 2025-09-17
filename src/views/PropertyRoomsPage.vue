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
      header="Chi tiết"
      position="right"
      class="!w-full md:!w-1/2"
    >
      <div v-if="selectedRoom" class="p-4 space-y-6">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-2xl font-semibold text-gray-900">{{ selectedRoom.name }}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
              Thông tin chung
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Tên phòng</span>
                <span class="font-medium text-gray-800">{{ selectedRoom.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Tầng</span>
                <span class="font-medium text-gray-800">{{ selectedRoom.floor ?? '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Diện tích</span>
                <span class="font-medium text-gray-800">{{
                  selectedRoom.area ? selectedRoom.area + ' m²' : '-'
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Giá</span>
                <span class="font-semibold text-gray-900">{{
                  formatCurrency(selectedRoom.price)
                }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
              Tình trạng
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Trạng thái</span>
                <Tag
                  :value="getRoomStatusValue(selectedRoom.status)"
                  :severity="getRoomStatusSeverity(selectedRoom.status)"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Số người hiện tại</span>
                <span class="font-medium text-gray-800">{{ selectedRoom.currentOccupants }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Số người tối đa</span>
                <span class="font-medium text-gray-800">{{ selectedRoom.maxOccupants }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
            <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
              Tiện nghi
            </div>
            <div class="text-sm text-gray-700 whitespace-pre-line">
              {{ selectedRoom.amenities || '-' }}
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
            <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Ghi chú</div>
            <div class="text-sm text-gray-700">{{ selectedRoom.note || '-' }}</div>
          </div>

          <div class="bg-white rounded-xl p-4 border border-gray-200 md:col-span-2">
            <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Lịch sử</div>
            <div class="grid grid-cols-1 gap-3 text-sm w-1/2">
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Tạo lúc</span>
                <span class="font-medium text-gray-800">{{
                  formatDate(selectedRoom.createdAt)
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Cập nhật lúc</span>
                <span class="font-medium text-gray-800">{{
                  formatDate(selectedRoom.updatedAt)
                }}</span>
              </div>
            </div>
          </div>
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
import { useCustomToast } from '@/composables/base/useCustomToast'

const route = useRoute()
const store = useMainStore()
const { tSuccess, tError } = useCustomToast()

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

function formatCurrency(v: number): string {
  return Number(v || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

function formatDate(value: Date | string | number | null | undefined): string {
  if (!value) return '-'
  try {
    const d = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(d.getTime())) return '-'
    return d.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '-'
  }
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
  selectedRoom.value = room.data
  isDrawerOpen.value = true
}

async function handleConfirmDelete(room: Room) {
  try {
    deleteModal.value?.setLoading(true)
    await deleteRoom(room.id, propertyId.value)
    await loadRooms()
    tSuccess('Thành công', 'Xóa phòng thành công')
  } catch (error) {
    const eMsg = error?.response?.data?.message ?? 'Xóa phòng thất bại'
    tError('Lỗi', eMsg)
  } finally {
    deleteModal.value?.setLoading(false)
    deleteModal.value?.close()
  }
}

function handleCancelDelete() {
  deletingRoom.value = null
  deleteModal.value?.close()
}

function handleRoomSaved() {
  loadRooms()
  tSuccess('Thành công', 'Thêm phòng thành công')
}

function handleRoomUpdated() {
  loadRooms()
  tSuccess('Thành công', 'Cập nhật phòng thành công')
}

async function loadRooms() {
  if (!propertyId.value) return
  loading.value = true
  try {
    const data = await getRooms(propertyId.value)
    rooms.value = data
  } catch (e) {
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
