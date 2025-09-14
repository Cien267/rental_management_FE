import { ref, computed } from 'vue'
import { useCustomToast } from '@/composables/base/useCustomToast'
import * as extraFeeService from '@/services/api/extraFeeService'
import type { ExtraFee, CreateExtraFeeInput, UpdateExtraFeeInput } from '@/types/extraFee'

export const useExtraFee = () => {
  const { tSuccess, tError } = useCustomToast()

  const extraFees = ref<ExtraFee[]>([])
  const currentExtraFee = ref<ExtraFee | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isEmpty = computed(() => !loading.value && extraFees.value.length === 0)

  const fetchExtraFees = async (propertyId?: number) => {
    loading.value = true
    error.value = null
    try {
      extraFees.value = await extraFeeService.getExtraFees(propertyId)
    } catch (err) {
      error.value = 'Failed to fetch extra fees'
      tError('Error', 'Failed to fetch extra fees')
    } finally {
      loading.value = false
    }
  }

  const fetchExtraFee = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentExtraFee.value = await extraFeeService.getExtraFee(id)
    } catch (err) {
      error.value = 'Failed to fetch extra fee'
      tError('Error', 'Failed to fetch extra fee')
    } finally {
      loading.value = false
    }
  }

  const createExtraFee = async (extraFeeData: CreateExtraFeeInput, propertyId?: number) => {
    loading.value = true
    error.value = null
    try {
      const newExtraFee = await extraFeeService.createExtraFee(extraFeeData, propertyId)
      extraFees.value.push(newExtraFee)
      tSuccess('Success', 'Extra fee created successfully')
      return newExtraFee
    } catch (err) {
      error.value = 'Failed to create extra fee'
      tError('Error', 'Failed to create extra fee')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateExtraFee = async (id: number, extraFeeData: UpdateExtraFeeInput) => {
    loading.value = true
    error.value = null
    try {
      const updatedExtraFee = await extraFeeService.updateExtraFee(id, extraFeeData)
      const index = extraFees.value.findIndex((extraFee) => extraFee.id === id)
      if (index !== -1) {
        extraFees.value[index] = updatedExtraFee
      }
      if (currentExtraFee.value?.id === id) {
        currentExtraFee.value = updatedExtraFee
      }
      tSuccess('Success', 'Extra fee updated successfully')
      return updatedExtraFee
    } catch (err) {
      error.value = 'Failed to update extra fee'
      tError('Error', 'Failed to update extra fee')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteExtraFee = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await extraFeeService.deleteExtraFee(id)
      extraFees.value = extraFees.value.filter((extraFee) => extraFee.id !== id)
      if (currentExtraFee.value?.id === id) {
        currentExtraFee.value = null
      }
      tSuccess('Success', 'Extra fee deleted successfully')
    } catch (err) {
      error.value = 'Failed to delete extra fee'
      tError('Error', 'Failed to delete extra fee')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    extraFees: computed(() => extraFees.value),
    currentExtraFee: computed(() => currentExtraFee.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isEmpty,
    fetchExtraFees,
    fetchExtraFee,
    createExtraFee,
    updateExtraFee,
    deleteExtraFee,
  }
}
