<template>
  <div class="h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <AppHeader
      :show-back-button="!!selectedProperty"
      @back-to-properties="handleBackToProperties"
    />

    <div class="flex flex-1">
      <!-- Left Sidebar (conditional) -->
      <AppSidebar v-if="selectedProperty" :property="selectedProperty" />

      <!-- Main Content -->
      <main class="h-full flex-1 flex flex-col relative">
        <AppBackground />
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
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import type { PropertyUI } from '@/types/property'
import AppBackground from '@/components/layout/AppBackground.vue'
import PageLoading from '@/components/base/atoms/PageLoading.vue'

// Props for layout configuration
interface Props {
  selectedProperty?: PropertyUI | null
}

withDefaults(defineProps<Props>(), {
  selectedProperty: null,
})

const emit = defineEmits<{
  'back-to-properties': []
}>()

const router = useRouter()

function handleBackToProperties() {
  emit('back-to-properties')
  // Navigate back to properties list
  router.push({ name: 'home' })
}
</script>

<style scoped></style>
