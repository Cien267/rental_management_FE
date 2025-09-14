import { ref, computed } from 'vue'
import { useCustomToast } from '@/composables/base/useCustomToast'
import * as utilityMeterReadingService from '@/services/api/utilityMeterReadingService'
import type {
  UtilityMeterReading,
  CreateUtilityMeterReadingInput,
  UpdateUtilityMeterReadingInput,
} from '@/types/utilityMeterReading'

export const useUtilityMeterReading = () => {
  const { tSuccess, tError } = useCustomToast()

  const utilityMeterReadings = ref<UtilityMeterReading[]>([])
  const currentUtilityMeterReading = ref<UtilityMeterReading | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isEmpty = computed(() => !loading.value && utilityMeterReadings.value.length === 0)

  const fetchUtilityMeterReadings = async (utilityMeterId?: number) => {
    loading.value = true
    error.value = null
    try {
      utilityMeterReadings.value =
        await utilityMeterReadingService.getUtilityMeterReadings(utilityMeterId)
    } catch (err) {
      error.value = 'Failed to fetch utility meter readings'
      tError('Error', 'Failed to fetch utility meter readings')
    } finally {
      loading.value = false
    }
  }

  const fetchUtilityMeterReading = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentUtilityMeterReading.value = await utilityMeterReadingService.getUtilityMeterReading(id)
    } catch (err) {
      error.value = 'Failed to fetch utility meter reading'
      tError('Error', 'Failed to fetch utility meter reading')
    } finally {
      loading.value = false
    }
  }

  const createUtilityMeterReading = async (
    readingData: CreateUtilityMeterReadingInput,
    utilityMeterId?: number,
  ) => {
    loading.value = true
    error.value = null
    try {
      const newReading = await utilityMeterReadingService.createUtilityMeterReading(
        readingData,
        utilityMeterId,
      )
      utilityMeterReadings.value.push(newReading)
      tSuccess('Success', 'Utility meter reading created successfully')
      return newReading
    } catch (err) {
      error.value = 'Failed to create utility meter reading'
      tError('Error', 'Failed to create utility meter reading')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUtilityMeterReading = async (
    id: number,
    readingData: UpdateUtilityMeterReadingInput,
  ) => {
    loading.value = true
    error.value = null
    try {
      const updatedReading = await utilityMeterReadingService.updateUtilityMeterReading(
        id,
        readingData,
      )
      const index = utilityMeterReadings.value.findIndex((reading) => reading.id === id)
      if (index !== -1) {
        utilityMeterReadings.value[index] = updatedReading
      }
      if (currentUtilityMeterReading.value?.id === id) {
        currentUtilityMeterReading.value = updatedReading
      }
      tSuccess('Success', 'Utility meter reading updated successfully')
      return updatedReading
    } catch (err) {
      error.value = 'Failed to update utility meter reading'
      tError('Error', 'Failed to update utility meter reading')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUtilityMeterReading = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await utilityMeterReadingService.deleteUtilityMeterReading(id)
      utilityMeterReadings.value = utilityMeterReadings.value.filter((reading) => reading.id !== id)
      if (currentUtilityMeterReading.value?.id === id) {
        currentUtilityMeterReading.value = null
      }
      tSuccess('Success', 'Utility meter reading deleted successfully')
    } catch (err) {
      error.value = 'Failed to delete utility meter reading'
      tError('Error', 'Failed to delete utility meter reading')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    utilityMeterReadings: computed(() => utilityMeterReadings.value),
    currentUtilityMeterReading: computed(() => currentUtilityMeterReading.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isEmpty,
    fetchUtilityMeterReadings,
    fetchUtilityMeterReading,
    createUtilityMeterReading,
    updateUtilityMeterReading,
    deleteUtilityMeterReading,
  }
}
