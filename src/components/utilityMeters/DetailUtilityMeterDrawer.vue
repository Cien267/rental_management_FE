<script setup lang="ts">
import { Drawer } from 'primevue'
import { formatDate } from '@/helpers/utils'
import Tag from 'primevue/tag'
import type { UtilityMeter, MeterType } from '@/types/utilityMeter'
import {
  getUtilityMeterStatusValue,
  getUtilityMeterStatusSeverity,
} from '@/transformers/utilityMeters'
import { UTILITY_METER_TYPES } from '@/constants/utilityMeters'
import { useRouter } from 'vue-router'
import { ROUTER_NAME_LIST } from '@/constants/routers'

const router = useRouter()
const { selectedUtilityMeter } = defineProps<{ selectedUtilityMeter: UtilityMeter | null }>()
const isDrawerOpen = defineModel('visible', { type: Boolean, default: false })

function goToRoomsList(roomId: number) {
  if (!selectedUtilityMeter?.room) return
  router.push({
    name: ROUTER_NAME_LIST.PROPERTY.ROOMS,
    params: { id: selectedUtilityMeter.room.propertyId },
    state: { roomId },
  })
}
</script>

<template>
  <Drawer
    v-model:visible="isDrawerOpen"
    :header="`Chi tiết cài đặt công tơ`"
    position="right"
    class="!w-full md:!w-1/2"
  >
    <div v-if="selectedUtilityMeter" class="p-4 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            Thông tin chung
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Loại</span>
              <span class="font-medium text-gray-800">{{
                UTILITY_METER_TYPES[selectedUtilityMeter.meterType as MeterType]
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Trạng thái</span>
              <span class="font-medium text-gray-800"
                ><Tag
                  :value="getUtilityMeterStatusValue(selectedUtilityMeter.active)"
                  :severity="getUtilityMeterStatusSeverity(selectedUtilityMeter.active)"
              /></span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Đơn vị</span>
              <span class="font-medium text-gray-800">{{ selectedUtilityMeter.unit }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Phòng</span>
              <span
                class="font-medium text-blue-600 cursor-pointer hover:underline"
                @click="goToRoomsList(selectedUtilityMeter.room?.id)"
              >
                {{ selectedUtilityMeter.room?.name }}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Ghi chú</div>
          <div class="text-sm text-gray-700">{{ selectedUtilityMeter.notes || '---' }}</div>
        </div>

        <div class="bg-white rounded-xl p-4 border border-gray-200 md:col-span-2">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Lịch sử</div>
          <div class="grid grid-cols-1 gap-3 text-sm w-1/2">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Tạo lúc</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedUtilityMeter.createdAt)
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Cập nhật lúc</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedUtilityMeter.updatedAt)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>
