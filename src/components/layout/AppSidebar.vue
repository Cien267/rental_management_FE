<template>
  <aside class="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
    <!-- Property Info Header -->
    <div class="p-4 border-only-bottom border-gray-100 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="flex-1 flex flex-col gap-2 min-w-0">
          <div class="text-lg font-bold text-gray-900 truncate">
            {{ property?.name || 'Nhà trọ' }}
          </div>
          <div class="text-xs text-gray-500 truncate">{{ property?.code || 'NT' }}</div>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4">
      <span
        v-for="item in SIDE_BAR_MENU"
        :key="item.key"
        @click="navigateTo(item.route)"
        class="flex items-center gap-3 px-3 py-2 my-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
        :class="[
          $route.name === item.route
            ? 'bg-sky-50 text-sky-700 border-r-2 border-sky-700 font-semibold'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
        ]"
      >
        <i :class="item.icon" class="text-base"></i>
        <span>{{ item.label }}</span>
      </span>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { SIDE_BAR_MENU } from '@/constants/menu'
import { useMainStore } from '@/stores/main'
import { useRouter } from 'vue-router'
const store = useMainStore()
const router = useRouter()
const property = store.getSelectedProperty

const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
}
</script>

<style scoped></style>
