<script setup lang="ts">
import { Drawer } from 'primevue'
import Tag from 'primevue/tag'
import { formatCurrency, formatDate } from '@/helpers/utils'
import type { ExtraFee, ChargeType } from '@/types/extraFee'
import { getExtraFeeStatusValue, getExtraFeeStatusSeverity } from '@/transformers/extraFees'
import { CHARGE_TYPES } from '@/constants/extraFees'

const { selectedExtraFee } = defineProps<{ selectedExtraFee: ExtraFee | null }>()
const isDrawerOpen = defineModel('visible', { type: Boolean, default: false })
</script>

<template>
  <Drawer
    v-model:visible="isDrawerOpen"
    :header="`Chi tiết ${selectedExtraFee?.name || ''}`"
    position="right"
    class="!w-full md:!w-1/2"
  >
    <div v-if="selectedExtraFee" class="p-4 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            Thông tin chung
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Tên chi phí</span>
              <span class="font-medium text-gray-800">{{ selectedExtraFee.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Giá</span>
              <span class="font-medium text-gray-800">{{
                formatCurrency(selectedExtraFee.amount ?? 0)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Trạng thái</span>
              <span class="font-medium text-gray-800"
                ><Tag
                  :value="getExtraFeeStatusValue(selectedExtraFee.isActive)"
                  :severity="getExtraFeeStatusSeverity(selectedExtraFee.isActive)"
              /></span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Kiểu thu phí</span>
              <span class="font-medium text-gray-800">{{
                CHARGE_TYPES[selectedExtraFee.chargeType as ChargeType]
              }}</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Ghi chú</div>
          <div class="text-sm text-gray-700">{{ selectedExtraFee.description || '---' }}</div>
        </div>

        <div class="bg-white rounded-xl p-4 border border-gray-200 md:col-span-2">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Lịch sử</div>
          <div class="grid grid-cols-1 gap-3 text-sm w-1/2">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Tạo lúc</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedExtraFee.createdAt)
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Cập nhật lúc</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedExtraFee.updatedAt)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>
