<template>
  <div class="h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <AppHeader
      :show-back-button="!!selectedProperty"
      @back-to-properties="handleBackToProperties"
    />

    <div class="flex flex-1">
      <!-- Mobile overlay -->
      <div
        v-if="selectedProperty"
        class="fixed inset-0 bg-black/40 z-30 lg:hidden"
        v-show="isSidebarOpenMobile"
        @click="closeMobileSidebar"
      ></div>

      <!-- Left Sidebar (conditional) -->
      <AppSidebar v-if="selectedProperty" :property="selectedProperty" />

      <!-- Main Content -->
      <main class="h-full flex-1 flex flex-col relative">
        <div class="flex-1 z-10">
          <Suspense>
            <template #default>
              <slot />
            </template>
            <template #fallback>
              <PageLoading />
            </template>
          </Suspense>
        </div>
      </main>
    </div>

    <!-- Footer (sticky to bottom) -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import type { PropertyUI } from '@/types/property'
import PageLoading from '@/components/base/atoms/PageLoading.vue'
import { useMainStore } from '@/stores/main'

// Props for layout configuration
interface Props {
  selectedProperty?: PropertyUI | null
}

withDefaults(defineProps<Props>(), {
  selectedProperty: null,
})

const router = useRouter()
const store = useMainStore()
const { isSidebarOpenMobile } = storeToRefs(store)

function handleBackToProperties() {
  router.push({ name: 'home' })
}

function closeMobileSidebar() {
  store.closeMobileSidebar()
}
</script>

<style scoped></style>
