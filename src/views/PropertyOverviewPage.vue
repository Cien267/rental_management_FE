<template>
  <DefaultLayout :selected-property="selectedProperty">
    <PageLoading v-if="loading" />
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-lg font-semibold text-gray-600">Tổng số phòng</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ stats.totalRooms ?? selectedProperty?.totalRooms ?? 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 shadow-flat bg-blue-50 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-home text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-lg font-semibold text-gray-600">Đã thuê</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ stats.rentedRooms ?? selectedProperty?.occupiedRooms ?? 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 shadow-flat bg-green-50 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-users text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-card border border-gray-200">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-lg font-semibold text-gray-600">Tỷ lệ lấp đầy</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ stats.occupancyRate ?? selectedProperty?.occupancyPercent ?? 0 }}%
              </p>
            </div>
            <div
              class="w-12 h-12 shadow-flat bg-purple-50 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-chart-pie text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 pb-0 border-b border-gray-200">
            <div class="text-lg font-semibold text-gray-600">
              <i class="pi pi-home mr-3 text-gray-500 !text-2xl"></i>Thông tin nhà trọ
            </div>
            <div class="text-gray-300 text-sm mt-1">Tổng quan về nhà trọ</div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 gap-8">
              <!-- Property Details -->
              <div class="space-y-3 w-full">
                <div class="flex justify-between">
                  <span class="text-gray-600">Tên:</span>
                  <span class="font-medium">{{
                    general.propertyName || selectedProperty?.name || '---'
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Địa chỉ:</span>
                  <span class="font-medium">{{
                    general.propertyAddress || selectedProperty?.address || '---'
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Mã:</span>
                  <span class="font-medium">{{
                    general.propertyCode || selectedProperty?.code || '---'
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Trạng thái:</span>
                  <Tag
                    v-if="selectedProperty?.statusLabel"
                    :value="selectedProperty?.statusLabel"
                    :severity="selectedProperty?.statusSeverity"
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Monthly Revenue -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="text-lg font-semibold text-gray-600">
              <i class="pi pi-dollar mr-3 text-emerald-500 !text-2xl"></i>Doanh thu tháng
            </div>
            <div class="text-gray-300 text-sm mt-1">Tổng doanh thu trong tháng này</div>
          </div>
          <div class="p-6">
            <div class="text-4xl font-bold text-gray-900">
              {{ formatCurrency(monthlyRevenue ?? 0) }}
            </div>
            <p class="text-sm text-gray-300 mt-4">Bao gồm tiền thuê, điện nước và các khoản phí</p>

            <div
              :class="monthlyRevenueChangePercent > 0 ? 'text-green-500' : 'text-red-500'"
              class="text-sm mt-2"
              v-if="monthlyRevenueChangePercent"
            >
              <i class="pi pi-chart-line"></i>
              <span>{{ monthlyRevenueChangePercent }}% so với tháng trước</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
        <!-- Room Status -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="text-lg font-semibold text-gray-600">
              <i class="pi pi-warehouse mr-3 text-sky-500 !text-2xl"></i>Tình trạng phòng
            </div>
            <div class="text-gray-300 text-sm mt-1">Số phòng đã thuê và còn trống</div>
          </div>
          <div class="p-6 space-y-4">
            <MeterGroup
              :value="roomStatusMeterGroupData"
              labelPosition="start"
              labelOrientation="vertical"
            />
          </div>
        </div>

        <!-- Attention Required -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="text-lg font-semibold text-gray-600">
              <i class="pi pi-exclamation-triangle mr-3 text-red-500 !text-2xl"></i>Cần chú ý
            </div>
            <div class="text-gray-300 text-sm mt-1">Các mục cần xử lý sớm</div>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Unpaid Invoices List -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <i class="pi pi-exclamation-circle text-red-600"></i>
                <span class="text-gray-700 font-medium">Hóa đơn chưa thanh toán</span>
                <span class="text-xs text-gray-400"
                  >({{ attentionRequired.unpaidInvoices?.length ?? 0 }})</span
                >
              </div>
              <div v-if="attentionRequired.unpaidInvoices?.length" class="space-y-3">
                <div
                  v-for="inv in attentionRequired.unpaidInvoices"
                  :key="inv.id"
                  class="p-3 rounded-lg border border-red-200 bg-red-50"
                >
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600">
                      Mã hóa đơn: <span class="font-medium">#{{ inv.id }}</span>
                    </div>
                    <div class="text-sm text-red-600 font-semibold">
                      {{ formatCurrency(inv.totalAmount) }}
                    </div>
                  </div>
                  <div class="mt-1 text-xs text-gray-500">
                    Kỳ: {{ inv.periodStart }} - {{ inv.periodEnd }}
                  </div>
                  <div class="mt-1 text-xs text-gray-400">
                    Ngày xuất: {{ inv.invoiceDate }} | HĐ thuê: #{{ inv.contractId }}
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-400">Không có hóa đơn nào.</div>
            </div>

            <!-- Expiring Contracts List -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <i class="pi pi-calendar-times text-amber-600"></i>
                <span class="text-gray-700 font-medium">Hợp đồng sắp hết hạn</span>
                <span class="text-xs text-gray-400"
                  >({{ attentionRequired.expiringContracts?.length ?? 0 }})</span
                >
              </div>
              <div v-if="attentionRequired.expiringContracts?.length" class="space-y-3">
                <div
                  v-for="ct in attentionRequired.expiringContracts"
                  :key="ct.id"
                  class="p-3 rounded-lg border border-amber-200 bg-amber-50"
                >
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600">
                      HĐ thuê: <span class="font-medium">#{{ ct.id }}</span>
                    </div>
                    <div class="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                      Sắp hết hạn
                    </div>
                  </div>
                  <div class="mt-1 text-xs text-gray-500">
                    Thời hạn: {{ ct.startDate }} → {{ ct.endDate }}
                  </div>
                  <div class="mt-1 text-xs text-gray-400">
                    Phòng: <span class="font-semibold">{{ ct.room?.name ?? '---' }}</span> | Khách:
                    <span class="font-semibold">{{ ct.tenant?.fullName ?? '---' }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-400">Không có hợp đồng nào.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import MeterGroup from 'primevue/metergroup'
import Tag from 'primevue/tag'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import type { Property, PropertyUI, PropertyDashboardResponse } from '@/types/property'
import { useRoute } from 'vue-router'
import { getProperty, getPropertyDashboard } from '@/services/api/propertyService'
import { transformPropertyToUI } from '@/transformers/properties'
import { formatCurrency } from '@/helpers/utils'
import { useMainStore } from '@/stores/main'
const store = useMainStore()

const loading = ref(false)
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
const monthlyRevenueChangePercent = ref<number>(0)

type RoomStatusKey = Exclude<
  keyof PropertyDashboardResponse['roomStatus'],
  'totalRooms' | 'occupancyRate'
>
interface RoomStatusItem {
  label: string
  color: string
  icon: string
  key: RoomStatusKey
  value: number
}

const roomStatusMeterGroupData = ref<RoomStatusItem[]>([
  { label: 'Đã thuê', color: '#34d399', value: 0, icon: 'pi pi-check', key: 'rentedRooms' },
  { label: 'Còn trống', color: '#60a5fa', value: 0, icon: 'pi pi-box', key: 'availableRooms' },
  {
    label: 'Đang bảo trì',
    color: '#fbbf24',
    value: 0,
    icon: 'pi pi-wrench',
    key: 'maintenanceRooms',
  },
])
const attentionRequired = ref<PropertyDashboardResponse['attentionRequired']>({
  unpaidInvoices: [],
  expiringContracts: [],
})

async function loadPropertyByRoute() {
  const idParam = route.params.id as string | undefined
  if (!idParam) {
    selectedProperty.value = null
    store.setSelectedProperty(null)
    return
  }
  const id = Number(idParam)
  loading.value = true
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
    monthlyRevenueChangePercent.value = dashboard.monthlyRevenueChangePercent
    roomStatusMeterGroupData.value = roomStatusMeterGroupData.value.map((item) => ({
      ...item,
      value: dashboard.roomStatus.totalRooms
        ? (dashboard.roomStatus[item.key] / dashboard.roomStatus.totalRooms) * 100
        : 0,
    }))
    attentionRequired.value = dashboard.attentionRequired
    loading.value = false
  } catch {
    loading.value = false
    selectedProperty.value = null
    store.setSelectedProperty(null)
  }
}

onMounted(loadPropertyByRoute)
watch(() => route.params.id, loadPropertyByRoute)

// Ensure initial load is awaited by Suspense boundary
loadPropertyByRoute()
</script>

<style scoped></style>
