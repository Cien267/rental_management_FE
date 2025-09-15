<template>
  <aside
    class="bg-white shadow-sm border-r border-gray-200 flex flex-col z-40"
    :class="[
      // Width on desktop
      isCollapsed ? 'lg:w-16' : 'lg:w-64',
      // Always render as flex; control positioning per breakpoint
      'w-64',
      // Mobile drawer positioning
      isSidebarOpenMobile ? 'fixed inset-y-0 left-0 w-full' : 'fixed -left-80 inset-y-0',
      // Desktop static positioning
      'lg:relative lg:left-0',
    ]"
  >
    <!-- Property Info Header -->
    <div class="p-4 border-only-bottom border-gray-100 shadow-sm">
      <div class="flex items-center gap-3 relative">
        <!-- Collapse toggle (desktop) -->
        <Button
          v-if="!isSidebarOpenMobile"
          severity="secondary"
          rounded
          raised
          size="small"
          :icon="isCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
          class="lg:flex hidden items-center justify-center !absolute top-full -right-[30px]"
          @click="toggleCollapse"
          :aria-label="isCollapsed ? 'Mở rộng' : 'Thu gọn'"
        >
        </Button>
        <!-- Close (mobile) -->
        <Button
          severity="secondary"
          rounded
          raised
          size="small"
          icon="pi pi-times"
          class="lg:!hidden"
          @click="closeMobileSidebar"
          aria-label="Đóng menu"
        >
        </Button>
        <div class="flex-1 flex flex-col gap-2 min-w-0" v-if="!isCollapsed">
          <div class="text-lg font-bold text-gray-900 truncate">
            {{ property?.name || 'Nhà trọ' }}
          </div>
          <div class="text-xs text-gray-500 truncate">{{ property?.code || 'NT' }}</div>
        </div>
        <div v-else class="flex-1"></div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4 flex flex-col justify-start items-start">
      <span
        v-for="item in SIDE_BAR_MENU"
        :key="item.key"
        @click="navigateTo(item.route)"
        class="flex items-center gap-3 px-3 py-2 my-2 text-sm font-medium rounded-lg transition-colors cursor-pointer w-full"
        :class="[
          $route.name === item.route
            ? 'bg-sky-50 text-sky-700 border-r-2 border-sky-700 font-semibold'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
          isCollapsed ? 'justify-center' : 'justify-start',
        ]"
      >
        <i :class="item.icon" class="text-base"></i>
        <span v-if="!isCollapsed">{{ item.label }}</span>
      </span>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Button from 'primevue/button'
import { SIDE_BAR_MENU } from '@/constants/menu'
import { useMainStore } from '@/stores/main'
import { useRouter } from 'vue-router'
const store = useMainStore()
const router = useRouter()
const property = store.getSelectedProperty

const navigateTo = (routeName: string) => {
  const id = property?.id as unknown as number
  router.push({ name: routeName, params: { id: String(id) } })
  // Close on mobile after navigation
  if (store.isSidebarOpenMobile) {
    store.closeMobileSidebar()
  }
}

const isCollapsed = computed(() => store.isSidebarCollapsed)
const isSidebarOpenMobile = computed(() => store.isSidebarOpenMobile)
function toggleCollapse() {
  store.toggleSidebarCollapse()
  // Persist preference
  localStorage.setItem('sidebar-collapsed', store.isSidebarCollapsed ? '1' : '0')
}

function closeMobileSidebar() {
  store.closeMobileSidebar()
}

onMounted(() => {
  const persisted = localStorage.getItem('sidebar-collapsed')
  if (persisted === '1') {
    store.setSidebarCollapse(true)
  }
})
</script>

<style scoped></style>
