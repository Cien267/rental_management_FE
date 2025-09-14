<template>
  <aside class="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
    <!-- Property Info Header -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <i class="pi pi-building text-blue-600"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-gray-900 truncate">{{ property.name }}</h3>
          <p class="text-xs text-gray-500 truncate">{{ property.code }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.key">
          <router-link
            :to="item.route"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="[
              $route.name === item.route.name
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            ]"
          >
            <i :class="item.icon" class="text-base"></i>
            <span>{{ item.label }}</span>
            <Badge
              v-if="item.badge"
              :value="item.badge"
              severity="danger"
              size="small"
              class="ml-auto"
            />
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Property Stats Footer -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <div class="space-y-2">
        <div class="flex justify-between text-xs">
          <span class="text-gray-500">Tổng phòng:</span>
          <span class="font-medium text-gray-900">{{ property.totalRooms || 0 }}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-gray-500">Đã thuê:</span>
          <span class="font-medium text-gray-900">{{ property.occupiedRooms || 0 }}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-gray-500">Tỷ lệ lấp đầy:</span>
          <span class="font-medium text-gray-900">{{ property.occupancyPercent || 0 }}%</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Badge from 'primevue/badge'
import type { PropertyUI } from '@/types/property'

interface Props {
  property: PropertyUI
}

const props = defineProps<Props>()

// Menu items for property management
const menuItems = computed(() => [
  {
    key: 'overview',
    label: 'Tổng quan',
    icon: 'pi pi-chart-pie',
    route: { name: 'property-overview', params: { propertyId: props.property.id } },
  },
  {
    key: 'rooms',
    label: 'Quản lý phòng',
    icon: 'pi pi-home',
    route: { name: 'property-rooms', params: { propertyId: props.property.id } },
    badge: props.property.totalRooms ? undefined : '0',
  },
  {
    key: 'tenants',
    label: 'Khách thuê',
    icon: 'pi pi-users',
    route: { name: 'property-tenants', params: { propertyId: props.property.id } },
    badge: props.property.occupiedRooms ? undefined : '0',
  },
  {
    key: 'contracts',
    label: 'Hợp đồng',
    icon: 'pi pi-file-text',
    route: { name: 'property-contracts', params: { propertyId: props.property.id } },
  },
  {
    key: 'invoices',
    label: 'Hóa đơn',
    icon: 'pi pi-receipt',
    route: { name: 'property-invoices', params: { propertyId: props.property.id } },
  },
  {
    key: 'utilities',
    label: 'Tiện ích',
    icon: 'pi pi-bolt',
    route: { name: 'property-utilities', params: { propertyId: props.property.id } },
  },
  {
    key: 'extra-fees',
    label: 'Phí phụ thu',
    icon: 'pi pi-money-bill',
    route: { name: 'property-extra-fees', params: { propertyId: props.property.id } },
  },
  {
    key: 'settings',
    label: 'Cài đặt',
    icon: 'pi pi-cog',
    route: { name: 'property-settings', params: { propertyId: props.property.id } },
  },
])
</script>

<style scoped></style>
