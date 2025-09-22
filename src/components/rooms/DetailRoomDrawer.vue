<script setup lang="ts">
import { Drawer } from 'primevue'
import Tag from 'primevue/tag'
import { formatCurrency, formatDate } from '@/helpers/utils'
import type { Room } from '@/types/room'
import { getRoomStatusValue, getRoomStatusSeverity } from '@/transformers/rooms'
import { useRouter } from 'vue-router'
import { ROUTER_NAME_LIST } from '@/constants/routers'

const { selectedRoom } = defineProps<{ selectedRoom: Room | null }>()
const isDrawerOpen = defineModel('visible', { type: Boolean, default: false })
const router = useRouter()

function goToRoomsList(tenantId: number) {
  if (!selectedRoom) return
  router.push({
    name: ROUTER_NAME_LIST.PROPERTY.TENANTS,
    params: { id: selectedRoom.propertyId },
    state: { tenantId },
  })
}
</script>

<template>
  <Drawer
    v-model:visible="isDrawerOpen"
    :header="`Chi tiết ${selectedRoom?.name || ''}`"
    position="right"
    class="!w-full md:!w-1/2"
  >
    <div v-if="selectedRoom" class="p-4 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-between items-center w-full">
              <div class="w-10 h-10 rounded-xl bg-sky-100 flex-center !hidden lg:!flex">
                <i class="pi pi-dollar"></i>
              </div>
              <p class="text-gray-400 font-semibold">Giá thuê</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              {{ formatCurrency(selectedRoom.price) }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-between items-center w-full">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 flex-center !hidden lg:!flex">
                <i class="pi pi-expand"></i>
              </div>
              <p class="text-gray-400 font-semibold">Diện tích</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              {{ selectedRoom.area ? selectedRoom.area + ' m²' : '-' }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-between items-center w-full">
              <div class="w-10 h-10 rounded-xl bg-gray-50 flex-center !hidden lg:!flex">
                <i class="pi pi-circle-fill text-blue-600"></i>
              </div>
              <p class="text-gray-400 font-semibold">Trạng thái</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              <Tag
                :value="getRoomStatusValue(selectedRoom.status)"
                :severity="getRoomStatusSeverity(selectedRoom.status)"
              />
            </p>
          </div>
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
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Tình trạng</div>
          <div class="space-y-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Số người hiện tại</span>
              <span class="font-medium text-gray-800">{{ selectedRoom.tenants?.length ?? 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Số người tối đa</span>
              <span class="font-medium text-gray-800">{{ selectedRoom.maxOccupants }}</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Tiện nghi</div>
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

        <div class="bg-white rounded-xl p-4 border border-gray-200 md:col-span-2">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-3">Người thuê</div>
          <div
            v-if="selectedRoom.tenants && selectedRoom.tenants.length"
            class="grid grid-cols-1 gap-6"
          >
            <div
              v-for="tenant in selectedRoom.tenants"
              :key="tenant.id"
              class="p-4 rounded-xl border border-gray-200 hover:border-sky-300 shadow hover:shadow-md hover:shadow-sky-300 cursor-pointer transition"
              @click="goToRoomsList(tenant.id)"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-sky-100 flex-center">
                  <i class="pi pi-user text-sky-600"></i>
                </div>
                <div>
                  <div class="font-semibold text-gray-800">{{ tenant.fullName }}</div>
                  <div class="text-sm text-gray-500">{{ tenant.phone || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500">Chưa có người thuê</div>
        </div>
      </div>
    </div>
  </Drawer>
</template>
