<template>
  <DefaultLayout :selected-property="selectedProperty">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Property Header -->
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
            <i class="pi pi-building text-blue-600 text-2xl"></i>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ general.propertyName || selectedProperty?.name }}
            </h1>
            <p class="text-gray-500">{{ general.propertyAddress || selectedProperty?.address }}</p>
            <div class="flex items-center gap-4 mt-2">
              <Tag
                :value="selectedProperty?.statusLabel"
                :severity="selectedProperty?.statusSeverity"
                rounded
              />
              <span class="text-sm text-gray-500"
                >Mã: {{ general.propertyCode || selectedProperty?.code }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Tổng phòng</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.totalRooms ?? selectedProperty?.totalRooms ?? 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-home text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Đã thuê</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.rentedRooms ?? selectedProperty?.occupiedRooms ?? 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-users text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Tỷ lệ lấp đầy</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.occupancyRate ?? selectedProperty?.occupancyPercent ?? 0 }}%
              </p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-chart-pie text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Thông tin bất động sản</h2>
          <p class="text-gray-500 mt-1">Tổng quan về thông tin cơ bản</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Property Details -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin chi tiết</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-500">Tên bất động sản:</span>
                  <span class="font-medium">{{
                    general.propertyName || selectedProperty?.name
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Địa chỉ:</span>
                  <span class="font-medium">{{
                    general.propertyAddress || selectedProperty?.address
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Mã bất động sản:</span>
                  <span class="font-medium">{{
                    general.propertyCode || selectedProperty?.code
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Trạng thái:</span>
                  <Tag
                    :value="selectedProperty?.statusLabel"
                    :severity="selectedProperty?.statusSeverity"
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
        <!-- Monthly Revenue -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Doanh thu tháng</h2>
            <p class="text-gray-500 mt-1">Tổng doanh thu trong tháng này</p>
          </div>
          <div class="p-6">
            <div class="text-4xl font-bold text-gray-900">
              {{
                (monthlyRevenue ?? 0).toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })
              }}
            </div>
            <p class="text-sm text-gray-500 mt-2">Bao gồm tiền thuê, điện nước và các khoản phí</p>
          </div>
        </div>

        <!-- Room Status -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Tình trạng phòng</h2>
            <p class="text-gray-500 mt-1">Số phòng đã thuê và còn trống</p>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-500">Tổng số phòng</span>
              <span class="font-medium">{{ roomStatus.totalRooms ?? 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Đã thuê</span>
              <span class="font-medium">{{ roomStatus.rentedRooms ?? 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Còn trống</span>
              <span class="font-medium">{{ roomStatus.availableRooms ?? 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Tỷ lệ lấp đầy</span>
              <span class="font-medium">{{ roomStatus.occupancyRate ?? 0 }}%</span>
            </div>
          </div>
        </div>

        <!-- Attention Required -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Cần chú ý</h2>
            <p class="text-gray-500 mt-1">Các mục cần xử lý sớm</p>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              class="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200"
            >
              <div class="flex items-center gap-3">
                <i class="pi pi-exclamation-circle text-red-600 text-xl"></i>
                <span class="text-gray-700">Hóa đơn chưa thanh toán</span>
              </div>
              <span class="text-lg font-semibold text-red-700">{{
                attentionRequired.unpaidInvoices ?? 0
              }}</span>
            </div>
            <div
              class="flex items-center justify-between p-4 rounded-lg bg-amber-50 border border-amber-200"
            >
              <div class="flex items-center gap-3">
                <i class="pi pi-calendar-times text-amber-600 text-xl"></i>
                <span class="text-gray-700">Hợp đồng sắp hết hạn</span>
              </div>
              <span class="text-lg font-semibold text-amber-700">{{
                attentionRequired.expiringContracts ?? 0
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import type { Property, PropertyUI } from '@/types/property'
import { useRoute } from 'vue-router'
import {
  getProperty,
  getPropertyDashboard,
  type PropertyDashboardResponse,
} from '@/services/api/propertyService'
import { transformPropertyToUI } from '@/transformers/properties'
import { useMainStore } from '@/stores/main'
const store = useMainStore()

const route = useRoute()
const selectedProperty = ref<PropertyUI | null>(null)
const stats = ref<PropertyDashboardResponse['stats']>({
  totalRooms: 0,
  occupancyRate: 0,
  rentedRooms: 0,
})
const general = ref<PropertyDashboardResponse['general']>({
  totalRooms: 0,
  occupancyRate: 0,
  propertyName: '',
  propertyCode: '',
  propertyAddress: '',
  propertyStatus: 0,
})
const monthlyRevenue = ref<number>(0)
const roomStatus = ref<PropertyDashboardResponse['roomStatus']>({
  totalRooms: 0,
  rentedRooms: 0,
  availableRooms: 0,
  occupancyRate: 0,
})
const attentionRequired = ref<PropertyDashboardResponse['attentionRequired']>({
  unpaidInvoices: 0,
  expiringContracts: 0,
})

async function loadPropertyByRoute() {
  const idParam = route.params.id as string | undefined
  if (!idParam) {
    selectedProperty.value = null
    store.setSelectedProperty(null)
    return
  }
  const id = Number(idParam)
  try {
    const prop: Property = await getProperty(id)
    // Optionally compute room stats here or fetch separately; use zeros for now
    const ui = transformPropertyToUI(prop, 0, 0)
    selectedProperty.value = ui
    store.setSelectedProperty(prop)
    const dashboard = await getPropertyDashboard(id)
    stats.value = dashboard.stats
    general.value = dashboard.general
    monthlyRevenue.value = dashboard.monthlyRevenue
    roomStatus.value = dashboard.roomStatus
    attentionRequired.value = dashboard.attentionRequired
  } catch (e) {
    selectedProperty.value = null
    store.setSelectedProperty(null)
  }
}

onMounted(loadPropertyByRoute)
watch(() => route.params.id, loadPropertyByRoute)
</script>

<style scoped></style>
