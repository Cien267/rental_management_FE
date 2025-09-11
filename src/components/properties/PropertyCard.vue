<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'

type PropertyStatus = 'active' | 'inactive' | 'maintenance'

interface RentalPropertyItem {
  id: string
  name: string
  code: string
  imageUrl?: string
  address: string
  totalRooms: number
  occupiedRooms: number
  status: PropertyStatus
}

const props = defineProps<{ property: RentalPropertyItem }>()
const emit = defineEmits<{ (e: 'manage', property: RentalPropertyItem): void }>()

function onManage() {
  emit('manage', props.property)
}

const percent = computed(() => {
  if (!props.property.totalRooms) return 0
  return Math.round((props.property.occupiedRooms / props.property.totalRooms) * 100)
})

function occupancyColor(p: number): string {
  if (p < 25) return 'bg-red-500'
  if (p < 50) return 'bg-orange-500'
  if (p < 75) return 'bg-amber-500'
  if (p < 90) return 'bg-sky-500'
  return 'bg-emerald-500'
}

function occupancyBg(p: number): string {
  if (p < 25) return '#ef4444' // red-500
  if (p < 50) return '#f97316' // orange-500
  if (p < 75) return '#f59e0b' // amber-500
  if (p < 90) return '#0ea5e9' // sky-500
  return '#10b981' // emerald-500
}
</script>

<template>
  <Card class="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
    <template #header>
      <div class="relative w-full h-48 bg-gray-100">
        <img v-if="props.property.imageUrl" :src="props.property.imageUrl" alt="Ảnh bất động sản" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
          <i class="pi pi-image text-3xl"></i>
        </div>
        <div class="absolute top-3 right-3">
          <Tag
            :value="props.property.status === 'active' ? 'Active' : props.property.status === 'maintenance' ? 'Maintenance' : 'Inactive'"
            :severity="props.property.status === 'active' ? 'success' : props.property.status === 'maintenance' ? 'warning' : 'secondary'"
            rounded
          />
        </div>
      </div>
    </template>
    <template #content>
      <div class="p-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-base font-semibold text-gray-900">{{ props.property.name }}</div>
            <div class="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <i class="pi pi-map-marker text-gray-400"></i>
              <span class="line-clamp-1">{{ props.property.address }}</span>
            </div>
          </div>
          <span class="px-2 py-1 rounded-md border text-xs text-gray-600 bg-gray-50 border-gray-200 whitespace-nowrap">{{ props.property.code }}</span>
        </div>

        <div class="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div class="flex items-center gap-2 text-gray-600">
            <i class="pi pi-home text-gray-400"></i>
            <div>
              <div class="text-xs text-gray-500">Total Rooms</div>
              <div class="font-medium text-gray-900">{{ props.property.totalRooms }}</div>
            </div>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <i class="pi pi-chart-line text-gray-400"></i>
            <div>
              <div class="text-xs text-gray-500">Occupied</div>
              <div class="font-medium text-gray-900">{{ Math.round((props.property.occupiedRooms / props.property.totalRooms) * 100) }}%</div>
            </div>
          </div>
          <div class="col-span-2 sm:col-span-1 flex items-center justify-end">
            <Button label="Manage" icon="pi pi-arrow-right" class="!py-2 bg-indigo-600 hover:bg-indigo-700 border-0" @click="onManage" />
          </div>
        </div>

        <div class="mt-5">
          <div class="text-xs text-gray-500 mb-1">Occupancy</div>
          <ProgressBar
            :value="percent"
            :showValue="false"
            :pt="{
              root: { class: 'h-1.5 bg-gray-200 rounded-full overflow-hidden' },
              value: { class: 'rounded-full', style: { backgroundColor: occupancyBg(percent) } }
            }"
          />
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>{{ props.property.occupiedRooms }}/{{ props.property.totalRooms }} rooms</span>
            <span>{{ percent }}%</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
  
</template>

<style scoped>
</style>


