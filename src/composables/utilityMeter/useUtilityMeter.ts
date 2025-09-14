import { ref, computed } from 'vue'
import { useCustomToast } from '@/composables/base/useCustomToast'
import * as utilityMeterService from '@/services/api/utilityMeterService'
import type {
  UtilityMeter,
  CreateUtilityMeterInput,
  UpdateUtilityMeterInput,
} from '@/types/utilityMeter'

export const useUtilityMeter = () => {
  const { tSuccess, tError } = useCustomToast()

  const utilityMeters = ref<UtilityMeter[]>([])
  const currentUtilityMeter = ref<UtilityMeter | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isEmpty = computed(() => !loading.value && utilityMeters.value.length === 0)

  const fetchUtilityMeters = async (propertyId?: number) => {
    loading.value = true
    error.value = null
    try {
      utilityMeters.value = await utilityMeterService.getUtilityMeters(propertyId)
    } catch (err) {
      error.value = 'Failed to fetch utility meters'
      tError('Error', 'Failed to fetch utility meters')
    } finally {
      loading.value = false
    }
  }

  const fetchUtilityMeter = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentUtilityMeter.value = await utilityMeterService.getUtilityMeter(id)
    } catch (err) {
      error.value = 'Failed to fetch utility meter'
      tError('Error', 'Failed to fetch utility meter')
    } finally {
      loading.value = false
    }
  }

  const createUtilityMeter = async (
    utilityMeterData: CreateUtilityMeterInput,
    propertyId?: number,
  ) => {
    loading.value = true
    error.value = null
    try {
      const newUtilityMeter = await utilityMeterService.createUtilityMeter(
        utilityMeterData,
        propertyId,
      )
      utilityMeters.value.push(newUtilityMeter)
      tSuccess('Success', 'Utility meter created successfully')
      return newUtilityMeter
    } catch (err) {
      error.value = 'Failed to create utility meter'
      tError('Error', 'Failed to create utility meter')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUtilityMeter = async (id: number, utilityMeterData: UpdateUtilityMeterInput) => {
    loading.value = true
    error.value = null
    try {
      const updatedUtilityMeter = await utilityMeterService.updateUtilityMeter(id, utilityMeterData)
      const index = utilityMeters.value.findIndex((utilityMeter) => utilityMeter.id === id)
      if (index !== -1) {
        utilityMeters.value[index] = updatedUtilityMeter
      }
      if (currentUtilityMeter.value?.id === id) {
        currentUtilityMeter.value = updatedUtilityMeter
      }
      tSuccess('Success', 'Utility meter updated successfully')
      return updatedUtilityMeter
    } catch (err) {
      error.value = 'Failed to update utility meter'
      tError('Error', 'Failed to update utility meter')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUtilityMeter = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await utilityMeterService.deleteUtilityMeter(id)
      utilityMeters.value = utilityMeters.value.filter((utilityMeter) => utilityMeter.id !== id)
      if (currentUtilityMeter.value?.id === id) {
        currentUtilityMeter.value = null
      }
      tSuccess('Success', 'Utility meter deleted successfully')
    } catch (err) {
      error.value = 'Failed to delete utility meter'
      tError('Error', 'Failed to delete utility meter')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    utilityMeters: computed(() => utilityMeters.value),
    currentUtilityMeter: computed(() => currentUtilityMeter.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isEmpty,
    fetchUtilityMeters,
    fetchUtilityMeter,
    createUtilityMeter,
    updateUtilityMeter,
    deleteUtilityMeter,
  }
}
