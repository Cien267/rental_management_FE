<script setup lang="ts">
import { computed } from 'vue'
import { Drawer } from 'primevue'
import Divider from 'primevue/divider'
import { UTILITY_METER_TYPES } from '@/constants/utilityMeters'
import Tag from 'primevue/tag'
import { formatDate, formatCurrency, formatNumber } from '@/helpers/utils'
import type { Invoice } from '@/types/invoice'
import { getInvoiceStatusValue, getInvoiceStatusSeverity } from '@/transformers/invoices'

const { selectedInvoice } = defineProps<{ selectedInvoice: Invoice | null }>()
const isDrawerOpen = defineModel('visible', { type: Boolean, default: false })

const titleHeader = computed(() => {
  return `Chi tiết hóa đơn ${selectedInvoice?.month}/${selectedInvoice?.year} ${selectedInvoice?.room?.name || ''}`
})

const utilitiesBreakdown = computed(() => {
  if (!selectedInvoice?.utilitiesBreakdown) return []
  return JSON.parse(selectedInvoice.utilitiesBreakdown)
})

const extraFeesBreakdown = computed(() => {
  if (!selectedInvoice?.extraFeesBreakdown) return []
  return JSON.parse(selectedInvoice.extraFeesBreakdown)
})
</script>

<template>
  <Drawer
    v-model:visible="isDrawerOpen"
    :header="titleHeader"
    position="right"
    class="!w-full md:!w-1/2"
  >
    <div v-if="selectedInvoice" class="p-4 space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-between items-center w-full">
              <div class="w-10 h-10 rounded-xl bg-blue-100 flex-center !hidden lg:!flex">
                <i class="pi pi-dollar text-blue-600"></i>
              </div>
              <p class="text-gray-400 font-semibold">Tổng số tiền</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              {{ formatCurrency(selectedInvoice.totalAmount) }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-between items-center w-full">
              <div class="w-10 h-10 rounded-xl bg-green-100 flex-center !hidden lg:!flex">
                <i class="pi pi-calendar text-green-600"></i>
              </div>
              <p class="text-gray-400 font-semibold">Tháng</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              {{ selectedInvoice.month }}/{{ selectedInvoice.year }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-between items-center w-full">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 flex-center !hidden lg:!flex">
                <i class="pi pi-circle text-emerald-600"></i>
              </div>
              <p class="text-gray-400 font-semibold">Trạng thái</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              <Tag
                :value="getInvoiceStatusValue(selectedInvoice.status || '')"
                :severity="getInvoiceStatusSeverity(selectedInvoice.status || '')"
              />
            </p>
          </div>
        </div>
      </div>

      <!-- Detailed Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            Thông tin cơ bản
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Ngày xuất hóa đơn</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedInvoice.invoiceDate, 'DD/MM/YYYY')
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Ngày bắt đầu</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedInvoice.periodStart, 'DD/MM/YYYY')
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Ngày kết thúc</span>
              <span class="font-medium text-gray-800">
                {{ formatDate(selectedInvoice.periodEnd, 'DD/MM/YYYY') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Room Information -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Chi phí</div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Tiền phòng</span>
              <span class="font-medium text-sky-600">
                {{ formatCurrency(selectedInvoice.rentAmount || 0) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Tiền điện nước</span>
              <span class="font-medium text-sky-600">
                {{ formatCurrency(selectedInvoice.utilitiesAmount || 0) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Phí khác</span>
              <span class="font-medium text-sky-600">
                {{ formatCurrency(selectedInvoice.extraFeesAmount || 0) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Tổng</span>
              <span class="font-medium text-sky-600">
                {{ formatCurrency(selectedInvoice.totalAmount || 0) }}
              </span>
            </div>
          </div>
        </div>

        <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mt-4 md:col-span-2">
          Chi tiết chi phí
        </div>
        <div class="flex justify-between md:col-span-2">
          <span class="text-sky-500 font-semibold"><i class="pi pi-tag"></i> Điện nước</span>
        </div>
        <div
          class="bg-gray-50 rounded-xl p-4 border border-gray-200"
          v-for="utility in utilitiesBreakdown"
          :key="utility.meterId"
        >
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            {{
              UTILITY_METER_TYPES[utility.meterType as keyof typeof UTILITY_METER_TYPES] || 'Khác'
            }}
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Số cũ</span>
              <span class="font-medium text-gray-800">
                {{ formatNumber(utility.previousReading || 0) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Số mới</span>
              <span class="font-medium text-gray-800">
                {{ formatNumber(utility.previousReading || 0) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Đã dùng</span>
              <span class="font-medium text-gray-800">
                {{ utility.usage }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Đơn giá</span>
              <span class="font-medium text-gray-800">
                {{ formatCurrency(utility.pricePerUnit) }}/ {{ utility.unit }}
              </span>
            </div>
            <Divider type="dashed" />
            <div class="flex justify-between">
              <span class="text-gray-500">Tổng tiền</span>
              <span class="font-bold text-sky-600">{{ formatCurrency(utility.total) }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-between md:col-span-2">
          <span class="text-sky-500 font-semibold"><i class="pi pi-tag"></i> Phí khác</span>
        </div>

        <div
          class="bg-gray-50 rounded-xl p-4 border border-gray-200"
          v-for="extra in extraFeesBreakdown"
          :key="extra.id"
        >
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            {{ extra.name || 'Khác' }}
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Mô tả</span>
              <span class="text-gray-800 w-2/3 text-end">{{ extra.description }}</span>
            </div>
            <Divider type="dashed" />
            <div class="flex justify-between">
              <span class="text-gray-500">Tổng tiền</span>
              <span class="font-bold text-sky-600">{{ formatCurrency(extra.amount) }}</span>
            </div>
          </div>
        </div>
        <!-- Notes -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Ghi chú</div>
          <div class="text-sm text-gray-700">{{ selectedInvoice.notes || '---' }}</div>
        </div>

        <!-- History -->
        <div class="bg-white rounded-xl p-4 border border-gray-200 md:col-span-2">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Lịch sử</div>
          <div class="grid grid-cols-1 gap-3 text-sm w-1/2">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Tạo lúc</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedInvoice.createdAt)
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Cập nhật lúc</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedInvoice.updatedAt)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>
