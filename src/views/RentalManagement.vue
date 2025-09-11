<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Image from 'primevue/image'
import { ROUTER_NAME_LIST } from '@/constants/routers'
import PropertyCard from '@/components/properties/PropertyCard.vue'

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

const router = useRouter()

// Placeholder: In real app, fetch properties from API
const properties = ref<RentalPropertyItem[]>([])
const loading = ref<boolean>(false)

const isEmpty = computed(() => !loading.value && properties.value.length === 0)

function goToProperty(property: RentalPropertyItem) {
  router.push({ name: ROUTER_NAME_LIST.RENTAL_PAGE, params: { code: property.code } })
}

function onAddProperty() {
  // Placeholder action. Replace with navigation to create-property when available
  // e.g., router.push({ name: ROUTER_NAME_LIST.PROPERTY_CREATE })
  // For now, simulate creating a property to transition from empty state
  const demo: RentalPropertyItem = {
    id: crypto.randomUUID(),
    name: 'Sunrise Apartment',
    code: 'SR-001',
    imageUrl: undefined,
    address: '123 Nguyễn Trãi, Hà Nội',
    totalRooms: 24,
    occupiedRooms: 18,
    status: 'active',
  }
  properties.value = [demo]
}

onMounted(async () => {
  loading.value = true
  try {
    // TODO: Replace with API call
    properties.value = [
      {
        id: crypto.randomUUID(),
        name: 'Sunset Apartments',
        code: 'SA001',
        imageUrl: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2069&auto=format&fit=crop',
        address: '123 Main Street, Downtown',
        totalRooms: 24,
        occupiedRooms: 18,
        status: 'active',
      },
      {
        id: crypto.randomUUID(),
        name: 'Garden View Complex',
        code: 'GV002',
        imageUrl: 'https://images.unsplash.com/photo-1502943693086-33b5b1cfdf2f?q=80&w=2070&auto=format&fit=crop',
        address: '456 Oak Avenue, Midtown',
        totalRooms: 16,
        occupiedRooms: 2,
        status: 'active',
      },
      {
        id: crypto.randomUUID(),
        name: 'City Center Lofts',
        code: 'CC003',
        imageUrl: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=2068&auto=format&fit=crop',
        address: '789 Business District, Center',
        totalRooms: 8,
        occupiedRooms: 6,
        status: 'maintenance',
      },
    ]
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Your Properties</h1>
          <p class="text-sm text-gray-500 mt-1">Select a property to manage rooms, tenants, and generate invoices.</p>
        </div>
        <Button label="Add Property" icon="pi pi-plus" class="bg-indigo-600 hover:bg-indigo-700 border-0" @click="onAddProperty" />
      </div>

      <div v-if="loading" class="text-gray-500">Loading...</div>

      <div v-else>
        <!-- Empty state -->
        <div v-if="isEmpty" class="border border-gray-100 rounded-2xl p-10 bg-gray-50 flex flex-col items-center text-center">
          <Image src="/src/assets/images/404.svg" alt="No properties" imageClass="w-56 h-56 object-contain" preview />
          <h2 class="mt-6 text-lg font-semibold text-gray-900">You have no properties yet</h2>
          <p class="mt-2 text-sm text-gray-500">Create your first property to start managing rentals.</p>
          <Button label="Add Property" icon="pi pi-plus" class="mt-6 bg-indigo-600 hover:bg-indigo-700 border-0" @click="onAddProperty" />
        </div>

        <!-- Property list grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCard v-for="property in properties" :key="property.id" :property="property" @manage="goToProperty" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


