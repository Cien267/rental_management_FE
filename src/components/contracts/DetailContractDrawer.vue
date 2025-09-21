<script setup lang="ts">
import { Drawer } from 'primevue'
import Tag from 'primevue/tag'
import { formatCurrency, formatDate } from '@/helpers/utils'
import type { Contract } from '@/types/contract'
import { CONTRACT_PAYMENT_CYCLES } from '@/constants/contracts'
import { getContractStatusValue, getContractStatusSeverity } from '@/transformers/contracts'
import { useRouter } from 'vue-router'
import { ROUTER_NAME_LIST } from '@/constants/routers'

const { selectedContract } = defineProps<{ selectedContract: Contract | null }>()
const isDrawerOpen = defineModel('visible', { type: Boolean, default: false })
const router = useRouter()

const goToRoomsList = () => {
  if (!selectedContract) return
  router.push({
    name: ROUTER_NAME_LIST.PROPERTY.ROOMS,
    params: { id: selectedContract.room.propertyId },
  })
}
const goToTenantsList = () => {
  if (!selectedContract) return
  router.push({
    name: ROUTER_NAME_LIST.PROPERTY.TENANTS,
    params: { id: selectedContract.room.propertyId },
  })
}
</script>

<template>
  <Drawer
    v-model:visible="isDrawerOpen"
    :header="`Chi tiết hợp đồng phòng ${selectedContract?.room.name || ''}`"
    position="right"
    class="!w-full md:!w-1/2"
  >
    <div v-if="selectedContract" class="p-4 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-between items-center w-full">
              <div class="w-10 h-10 rounded-xl bg-sky-100 flex-center !hidden lg:!flex">
                <i class="pi pi-home"></i>
              </div>
              <p class="text-gray-400 font-semibold">Phòng</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              {{ selectedContract.room?.name || '---' }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-between items-center w-full">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 flex-center !hidden lg:!flex">
                <i class="pi pi-user"></i>
              </div>
              <p class="text-gray-400 font-semibold">Người kí</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              {{ selectedContract.tenant?.fullName || '---' }}
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
                :value="getContractStatusValue(selectedContract.status)"
                :severity="getContractStatusSeverity(selectedContract.status)"
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
              <span class="text-gray-500">Phòng</span>
              <span
                v-if="selectedContract.room"
                @click="goToRoomsList"
                class="font-medium text-blue-600 cursor-pointer hover:underline"
                >{{ selectedContract.room?.name || '---' }}</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Người kí hợp đồng</span>
              <span
                v-if="selectedContract.tenant"
                @click="goToTenantsList"
                class="font-medium text-blue-600 cursor-pointer hover:underline"
                >{{ selectedContract.tenant?.fullName || '---' }}</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Tiền cọc</span>
              <span class="font-bold text-blue-600">{{
                formatCurrency(selectedContract.depositAmount ?? 0)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Kì thanh toán</span>
              <span class="font-medium text-gray-800">{{
                CONTRACT_PAYMENT_CYCLES[selectedContract.paymentCycle]
              }}</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Thời hạn</div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Ngày bắt đầu</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedContract.startDate, 'DD/MM/YYYY')
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Ngày kết thúc</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedContract.endDate, 'DD/MM/YYYY')
              }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 border border-gray-200 md:col-span-2">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Lịch sử</div>
          <div class="grid grid-cols-1 gap-3 text-sm w-1/2">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Tạo lúc</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedContract.createdAt)
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Cập nhật lúc</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedContract.updatedAt)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>
