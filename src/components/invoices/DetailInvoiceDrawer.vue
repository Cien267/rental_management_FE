<script setup lang="ts">
import { computed, ref } from 'vue'
import { Drawer } from 'primevue'
import Divider from 'primevue/divider'
import { UTILITY_METER_TYPES } from '@/constants/utilityMeters'
import Tag from 'primevue/tag'
import { formatDate, formatCurrency, formatNumber } from '@/helpers/utils'
import type { Invoice } from '@/types/invoice'
import { getInvoiceStatusValue, getInvoiceStatusSeverity } from '@/transformers/invoices'
import * as htmlToImage from 'html-to-image'
import Button from 'primevue/button'

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

const downloading = ref(false)
const fileTitle = computed(() => {
  return `Hóa đơn ${selectedInvoice?.month}_${selectedInvoice?.year} - ${selectedInvoice?.room?.name || ''}`
})
const onCapture = async () => {
  const node = document.querySelector(`#invoice-detail-${selectedInvoice?.id}`) as HTMLElement
  if (!node) return

  downloading.value = true

  const dataUrl = await htmlToImage.toPng(node, {
    cacheBust: true,
    backgroundColor: '#ffffff',
    pixelRatio: 2,
  })

  const link = document.createElement('a')
  link.download = `${fileTitle.value}.png`
  link.href = dataUrl
  link.click()

  downloading.value = false
}
</script>

<template>
  <Drawer
    v-model:visible="isDrawerOpen"
    :header="titleHeader"
    position="right"
    class="!w-full md:!w-1/2"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <div class="p-drawer-title">{{ titleHeader }}</div>
        <Button
          aria-label="Tải hóa đơn"
          severity="primary"
          size="small"
          icon="pi pi-download"
          @click="onCapture()"
          rounded
          class="ml-3"
        />
      </div>
    </template>
    <div v-if="selectedInvoice" class="p-4 space-y-6" :id="`invoice-detail-${selectedInvoice.id}`">
      <div v-if="downloading" class="w-full text-center font-bold text-lg text-gray-800 my-4">
        {{ titleHeader }}
      </div>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl p-6 border-2 border-solid border-gray-100 shadow-card">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-center items-center w-full gap-2">
              <div class="w-10 h-10 rounded-xl flex-center !hidden lg:!flex text-3xl">💰</div>
              <p class="text-lg text-gray-600 font-semibold">Tổng số tiền</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              {{ formatCurrency(selectedInvoice.totalAmount) }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-card border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-center gap-2 items-center w-full">
              <div class="w-10 h-10 rounded-xl flex-center !hidden lg:!flex text-3xl">📅</div>
              <p class="text-lg text-gray-600 font-semibold">Tháng</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              {{ selectedInvoice.month }}/{{ selectedInvoice.year }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-card border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-center gap-2 items-center w-full">
              <div class="w-10 h-10 rounded-xl flex-center !hidden lg:!flex text-3xl">🕓</div>
              <p class="text-lg text-gray-600 font-semibold">Trạng thái</p>
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
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-lg">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            Thông tin cơ bản
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Ngày xuất hóa đơn</span>
              <span class="font-semibold text-gray-800">{{
                formatDate(selectedInvoice.invoiceDate, 'DD/MM/YYYY')
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Ngày bắt đầu</span>
              <span class="font-semibold text-gray-800">{{
                formatDate(selectedInvoice.periodStart, 'DD/MM/YYYY')
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Ngày kết thúc</span>
              <span class="font-semibold text-gray-800">
                {{ formatDate(selectedInvoice.periodEnd, 'DD/MM/YYYY') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Room Information -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-lg">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Chi phí</div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Tiền phòng</span>
              <span class="font-semibold text-sky-600">
                {{ formatCurrency(selectedInvoice.rentAmount || 0) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tiền điện nước</span>
              <span class="font-semibold text-sky-600">
                {{ formatCurrency(selectedInvoice.utilitiesAmount || 0) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Phí khác</span>
              <span class="font-semibold text-sky-600">
                {{ formatCurrency(selectedInvoice.extraFeesAmount || 0) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tổng</span>
              <span class="font-semibold text-sky-600">
                {{ formatCurrency(selectedInvoice.totalAmount || 0) }}
              </span>
            </div>
          </div>
        </div>

        <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mt-4 md:col-span-2">
          Chi tiết chi phí ⤵️
        </div>
        <div class="flex justify-between md:col-span-2">
          <span class="text-sky-500 font-semibold"><i class="pi pi-tag"></i> Điện nước</span>
        </div>
        <div
          class="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-lg"
          v-for="utility in utilitiesBreakdown"
          :key="utility.meterId"
        >
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            <span v-if="utility.meterType === 'electricity'">⚡</span>
            <span v-else>💧</span>
            {{
              UTILITY_METER_TYPES[utility.meterType as keyof typeof UTILITY_METER_TYPES] || 'Khác'
            }}
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Số cũ</span>
              <span class="font-semibold text-gray-800">
                {{ formatNumber(utility.previousReading || 0) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Số mới</span>
              <span class="font-semibold text-gray-800">
                {{ formatNumber(utility.latestReading || 0) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Đã dùng</span>
              <span class="font-semibold text-gray-800">
                {{ utility.usage }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Đơn giá</span>
              <span class="font-semibold text-gray-800">
                {{ formatCurrency(utility.pricePerUnit) }}/ {{ utility.unit }}
              </span>
            </div>
            <Divider type="dashed" />
            <div class="flex justify-between">
              <span class="text-gray-600">Tổng tiền</span>
              <span class="font-bold text-sky-600">{{ formatCurrency(utility.total) }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-between md:col-span-2">
          <span class="text-sky-500 font-semibold"><i class="pi pi-tag"></i> Phí khác</span>
        </div>

        <div
          class="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-lg"
          v-for="extra in extraFeesBreakdown"
          :key="extra.id"
        >
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            {{ extra.name || 'Khác' }}
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Mô tả</span>
              <span class="text-gray-800 w-2/3 text-end">{{ extra.description }}</span>
            </div>
            <Divider type="dashed" />
            <div class="flex justify-between">
              <span class="text-gray-600">Tổng tiền</span>
              <span class="font-bold text-sky-600">{{ formatCurrency(extra.amount) }}</span>
            </div>
          </div>
        </div>
        <!-- Notes -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2 shadow-lg">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Ghi chú</div>
          <div class="text-sm text-gray-700">{{ selectedInvoice.notes || '---' }}</div>
        </div>

        <!-- History -->
        <div class="bg-white rounded-xl p-4 border border-gray-200 md:col-span-2">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Lịch sử</div>
          <div class="grid grid-cols-1 gap-3 text-sm w-1/2">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Tạo lúc</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedInvoice.createdAt)
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Cập nhật lúc</span>
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
