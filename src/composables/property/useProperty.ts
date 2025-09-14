import { ref, computed } from 'vue'
import { useCustomToast } from '@/composables/base/useCustomToast'
import * as propertyService from '@/services/api/propertyService'
import type { Property, CreatePropertyInput, UpdatePropertyInput } from '@/types/property'

export const useProperty = () => {
  const { tSuccess, tError } = useCustomToast()

  const properties = ref<Property[]>([])
  const currentProperty = ref<Property | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isEmpty = computed(() => !loading.value && properties.value.length === 0)

  const fetchProperties = async () => {
    loading.value = true
    error.value = null
    try {
      properties.value = await propertyService.getProperties()
    } catch (err) {
      error.value = 'Failed to fetch properties'
      tError('Error', 'Failed to fetch properties')
    } finally {
      loading.value = false
    }
  }

  const fetchProperty = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentProperty.value = await propertyService.getProperty(id)
    } catch (err) {
      error.value = 'Failed to fetch property'
      tError('Error', 'Failed to fetch property')
    } finally {
      loading.value = false
    }
  }

  const createProperty = async (propertyData: CreatePropertyInput) => {
    loading.value = true
    error.value = null
    try {
      const newProperty = await propertyService.createProperty(propertyData)
      properties.value.push(newProperty)
      tSuccess('Success', 'Property created successfully')
      return newProperty
    } catch (err) {
      error.value = 'Failed to create property'
      tError('Error', 'Failed to create property')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProperty = async (id: number, propertyData: UpdatePropertyInput) => {
    loading.value = true
    error.value = null
    try {
      const updatedProperty = await propertyService.updateProperty(id, propertyData)
      const index = properties.value.findIndex((property) => property.id === id)
      if (index !== -1) {
        properties.value[index] = updatedProperty
      }
      if (currentProperty.value?.id === id) {
        currentProperty.value = updatedProperty
      }
      tSuccess('Success', 'Property updated successfully')
      return updatedProperty
    } catch (err) {
      error.value = 'Failed to update property'
      tError('Error', 'Failed to update property')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProperty = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await propertyService.deleteProperty(id)
      properties.value = properties.value.filter((property) => property.id !== id)
      if (currentProperty.value?.id === id) {
        currentProperty.value = null
      }
      tSuccess('Success', 'Property deleted successfully')
    } catch (err) {
      error.value = 'Failed to delete property'
      tError('Error', 'Failed to delete property')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    properties: computed(() => properties.value),
    currentProperty: computed(() => currentProperty.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isEmpty,
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
  }
}
