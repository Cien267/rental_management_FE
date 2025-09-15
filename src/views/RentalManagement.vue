<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PropertyCard from '@/components/properties/PropertyCard.vue'
import UpSertPropertyModal from '@/components/properties/UpSertPropertyModal.vue'
import type { PropertyUI, Property } from '@/types/property'
import { transformPropertyToUI } from '@/transformers/properties'
import { getProperties, deleteProperty } from '@/services/api/propertyService'
import { useCustomToast } from '@/composables/base/useCustomToast'
import DeletePropertyModal from '@/components/properties/DeletePropertyModal.vue'
import { useMainStore } from '@/stores/main'
import { useRouter } from 'vue-router'
import { ROUTER_NAME_LIST } from '@/constants/routers'

const store = useMainStore()
const router = useRouter()
const properties = ref<PropertyUI[]>([])
const propertyModal = ref<InstanceType<typeof UpSertPropertyModal> | null>(null)
const deleteModal = ref<InstanceType<typeof DeletePropertyModal> | null>(null)
const editingProperty = ref<Property | null>(null)
const deletingProperty = ref<PropertyUI | null>(null)
const { tError, tSuccess } = useCustomToast()
const isEmpty = computed(() => properties.value.length === 0)

function goToProperty(property: PropertyUI) {
  store.setSelectedProperty(property)
  router.push({ name: ROUTER_NAME_LIST.PROPERTY.OVERVIEW })
}

function onAddProperty() {
  editingProperty.value = null
  propertyModal.value?.open()
}

function onEditProperty(property: PropertyUI) {
  // Convert PropertyUI back to Property for editing
  const baseProperty: Property = {
    id: property.id,
    userId: property.userId,
    name: property.name,
    code: property.code,
    address: property.address || '',
    type: property.type || '',
    floors: property.floors || undefined,
    image: property.image || '',
    status: property.status,
    note: property.note || '',
    contactName: property.contactName || '',
    contactPhone: property.contactPhone || '',
    contactMail: property.contactMail || '',
    electricityPricePerKwh: property.electricityPricePerKwh || undefined,
    waterPricePerM3: property.waterPricePerM3 || undefined,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  }
  editingProperty.value = baseProperty
  propertyModal.value?.open()
}

function handlePropertySaved(property: Property) {
  loadProperties()
}

function handlePropertyUpdated(property: Property) {
  loadProperties()
}

function onDeleteProperty({ property }: { property: PropertyUI; event: any }) {
  deletingProperty.value = property
  deleteModal.value?.open()
}

async function handleConfirmDelete(property: PropertyUI) {
  try {
    deleteModal.value?.setLoading(true)
    await deleteProperty(property.id)
    tSuccess('Thành công', 'Xóa nhà trọ thành công')
    // Refresh the list
    loadProperties()
    deleteModal.value?.close()
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Có lỗi xảy ra khi xóa nhà trọ'
    tError('Lỗi', msg)
    console.error('Delete property error:', error)
  } finally {
    deleteModal.value?.setLoading(false)
  }
}

function handleCancelDelete() {
  deletingProperty.value = null
  deleteModal.value?.close()
}

async function loadProperties() {
  try {
    const apiProperties = await getProperties()

    // Transform properties with room counts (TODO: Get actual room counts from API)
    const roomCounts = {
      1: { total: 24, occupied: 18 },
      2: { total: 16, occupied: 2 },
      3: { total: 8, occupied: 7 },
    }

    properties.value = apiProperties.map((property) =>
      transformPropertyToUI(
        property,
        roomCounts[property.id as keyof typeof roomCounts]?.total || 0,
        roomCounts[property.id as keyof typeof roomCounts]?.occupied || 0,
      ),
    )
  } catch (error) {
    tError('Lỗi', 'Không thể tải danh sách nhà trọ')
    console.error('Load properties error:', error)

    // Set empty array to prevent breaking the UI
    properties.value = []
  }
}

// Async setup - this will be awaited by Suspense
loadProperties()
</script>

<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Nhà trọ của bạn</h1>
        </div>
        <Button
          v-if="!isEmpty"
          label="Thêm nhà trọ"
          icon="pi pi-plus"
          class="!bg-sky-600 hover:!bg-sky-700 border-0"
          severity="info"
          @click="onAddProperty"
        />
      </div>

      <div>
        <!-- Empty state -->
        <div
          v-if="isEmpty"
          class="border border-gray-100 rounded-2xl p-10 bg-gray-50 flex flex-col items-center text-center"
        >
          <img src="/src/assets//images/empty-house.png" alt="" class="w-80 h-80" />
          <h2 class="mt-6 text-lg font-semibold text-gray-900">Bạn chưa có nhà trọ nào!</h2>
          <p class="mt-2 text-sm text-gray-500">
            Tạo nhà trọ đầu tiên để bắt đầu quản lý cho thuê.
          </p>
          <Button
            label="Thêm nhà trọ đầu tiên"
            icon="pi pi-plus"
            class="mt-6 bg-indigo-600 hover:bg-indigo-700 border-0 animate-pulse hover:animate-none"
            @click="onAddProperty"
          />
        </div>

        <!-- Property list grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCard
            v-for="property in properties"
            :key="property.id"
            :property="property"
            @manage="goToProperty"
            @edit="onEditProperty"
            @delete="onDeleteProperty"
          />
        </div>
      </div>
    </div>

    <!-- Property Modal -->
    <UpSertPropertyModal
      ref="propertyModal"
      :property="editingProperty"
      @property-saved="handlePropertySaved"
      @property-updated="handlePropertyUpdated"
    />

    <!-- Delete Property Modal -->
    <DeletePropertyModal
      ref="deleteModal"
      :property="deletingProperty"
      @confirm-delete="handleConfirmDelete"
      @cancel-delete="handleCancelDelete"
    />
  </DefaultLayout>
</template>

<style scoped></style>
