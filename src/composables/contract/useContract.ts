import { ref, computed } from 'vue'
import { useCustomToast } from '@/composables/base/useCustomToast'
import * as contractService from '@/services/api/contractService'
import type { Contract, CreateContractInput, UpdateContractInput } from '@/types/contract'

export const useContract = () => {
  const { tSuccess, tError } = useCustomToast()

  const contracts = ref<Contract[]>([])
  const currentContract = ref<Contract | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isEmpty = computed(() => !loading.value && contracts.value.length === 0)

  const fetchContracts = async () => {
    loading.value = true
    error.value = null
    try {
      contracts.value = await contractService.getContracts()
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to fetch contracts'
      error.value = eMsg
      tError('Error', eMsg)
    } finally {
      loading.value = false
    }
  }

  const fetchContract = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentContract.value = await contractService.getContract(id)
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to fetch contract'
      error.value = eMsg
      tError('Error', eMsg)
    } finally {
      loading.value = false
    }
  }

  const createContract = async (contractData: CreateContractInput) => {
    loading.value = true
    error.value = null
    try {
      const newContract = await contractService.createContract(contractData)
      contracts.value.push(newContract)
      tSuccess('Success', 'Contract created successfully')
      return newContract
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to create contract'
      error.value = eMsg
      tError('Error', eMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateContract = async (id: number, contractData: UpdateContractInput) => {
    loading.value = true
    error.value = null
    try {
      const updatedContract = await contractService.updateContract(id, contractData)
      const index = contracts.value.findIndex((contract) => contract.id === id)
      if (index !== -1) {
        contracts.value[index] = updatedContract
      }
      if (currentContract.value?.id === id) {
        currentContract.value = updatedContract
      }
      tSuccess('Success', 'Contract updated successfully')
      return updatedContract
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to update contract'
      error.value = eMsg
      tError('Error', eMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteContract = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await contractService.deleteContract(id)
      contracts.value = contracts.value.filter((contract) => contract.id !== id)
      if (currentContract.value?.id === id) {
        currentContract.value = null
      }
      tSuccess('Success', 'Contract deleted successfully')
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to delete contract'
      error.value = eMsg
      tError('Error', eMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    contracts: computed(() => contracts.value),
    currentContract: computed(() => currentContract.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isEmpty,
    fetchContracts,
    fetchContract,
    createContract,
    updateContract,
    deleteContract,
  }
}
