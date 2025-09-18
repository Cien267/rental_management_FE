<script setup lang="ts">
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import type { PropertyUI } from '@/types/property'

const props = defineProps<{ property: PropertyUI }>()
const emit = defineEmits(['manage', 'edit', 'delete'])

function onCardClick() {
  emit('manage', props.property)
}

function onEditClick(event: Event) {
  event.stopPropagation() // Prevent card click
  emit('edit', props.property)
}

function onDeleteClick(event: Event) {
  event.stopPropagation() // Prevent card click
  emit('delete', { property: props.property, event: event })
}
</script>

<template>
  <Card
    class="shadow-xl bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-500"
    @click="onCardClick"
  >
    <template #header>
      <div class="relative w-full h-56 bg-gray-100">
        <img
          v-if="props.property.image"
          :src="props.property.image"
          alt="Ảnh bất động sản"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
          <i class="pi pi-image text-3xl"></i>
        </div>
        <div class="absolute top-3 left-3 flex items-center gap-2">
          <Tag
            :value="props.property.statusLabel"
            :severity="props.property.statusSeverity"
            rounded
          />
        </div>

        <!-- Edit Button -->
        <div class="absolute top-3 right-3 flex-between gap-2">
          <Button
            icon="pi pi-pencil"
            severity="warn"
            raised
            rounded
            aria-label="edit"
            size="small"
            @click="onEditClick"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            size="small"
            rounded
            aria-label="delete"
            @click="onDeleteClick"
          />
        </div>
      </div>
    </template>
    <template #content>
      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-base font-semibold text-gray-900">{{ props.property.name }}</div>
            <div class="text-sm text-gray-500 mt-8 flex items-center gap-2">
              <i class="pi pi-map-marker text-gray-400"></i>
              <span class="line-clamp-1">{{ props.property.address }}</span>
            </div>
          </div>
          <span
            v-if="props.property.code"
            class="px-2 py-1 rounded-md border text-xs text-gray-600 bg-gray-50 border-gray-200 whitespace-nowrap"
            >{{ props.property.code }}</span
          >
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div class="flex items-start gap-2 text-gray-600">
            <i class="pi pi-home text-gray-400"></i>
            <div>
              <div class="text-xs text-gray-500">Tổng số phòng</div>
              <div class="font-bold text-gray-900">{{ props.property.totalRooms || 0 }}</div>
            </div>
          </div>
          <div class="flex items-start gap-2 text-gray-600">
            <i class="pi pi-chart-line text-gray-400"></i>
            <div>
              <div class="text-xs text-gray-500">Đã thuê</div>
              <div class="font-bold text-gray-900">{{ props.property.occupancyPercent || 0 }}%</div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <div class="text-xs text-gray-500 mb-2">Tỷ lệ lấp đầy</div>
          <ProgressBar
            :value="props.property.occupancyPercent || 0"
            :showValue="false"
            :pt="{
              root: { class: '!h-2 bg-gray-200 rounded-full overflow-hidden' },
              value: {
                class: 'rounded-full',
                style: { backgroundColor: props.property.occupancyBgColor },
              },
            }"
          />
          <div class="flex justify-between text-xs text-gray-400 mt-2">
            <span
              >{{ props.property.occupiedRooms || 0 }}/{{
                props.property.totalRooms || 0
              }}
              phòng</span
            >
            <span>{{ props.property.occupancyPercent || 0 }}%</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped></style>
