import { ref, computed } from 'vue'
import { useCustomToast } from '@/composables/base/useCustomToast'
import * as tenantService from '@/services/api/tenantService'
import type { Tenant, CreateTenantInput, UpdateTenantInput } from '@/types/tenant'

export const useTenant = () => {
  const { tSuccess, tError } = useCustomToast()

  const tenants = ref<Tenant[]>([])
  const currentTenant = ref<Tenant | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isEmpty = computed(() => !loading.value && tenants.value.length === 0)

  const fetchTenants = async () => {
    loading.value = true
    error.value = null
    try {
      tenants.value = await tenantService.getTenants()
    } catch (err) {
      error.value = 'Failed to fetch tenants'
      tError('Error', 'Failed to fetch tenants')
    } finally {
      loading.value = false
    }
  }

  const fetchTenant = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentTenant.value = await tenantService.getTenant(id)
    } catch (err) {
      error.value = 'Failed to fetch tenant'
      tError('Error', 'Failed to fetch tenant')
    } finally {
      loading.value = false
    }
  }

  const createTenant = async (tenantData: CreateTenantInput) => {
    loading.value = true
    error.value = null
    try {
      const newTenant = await tenantService.createTenant(tenantData)
      tenants.value.push(newTenant)
      tSuccess('Success', 'Tenant created successfully')
      return newTenant
    } catch (err) {
      error.value = 'Failed to create tenant'
      tError('Error', 'Failed to create tenant')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTenant = async (id: number, tenantData: UpdateTenantInput) => {
    loading.value = true
    error.value = null
    try {
      const updatedTenant = await tenantService.updateTenant(id, tenantData)
      const index = tenants.value.findIndex((tenant) => tenant.id === id)
      if (index !== -1) {
        tenants.value[index] = updatedTenant
      }
      if (currentTenant.value?.id === id) {
        currentTenant.value = updatedTenant
      }
      tSuccess('Success', 'Tenant updated successfully')
      return updatedTenant
    } catch (err) {
      error.value = 'Failed to update tenant'
      tError('Error', 'Failed to update tenant')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTenant = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await tenantService.deleteTenant(id)
      tenants.value = tenants.value.filter((tenant) => tenant.id !== id)
      if (currentTenant.value?.id === id) {
        currentTenant.value = null
      }
      tSuccess('Success', 'Tenant deleted successfully')
    } catch (err) {
      error.value = 'Failed to delete tenant'
      tError('Error', 'Failed to delete tenant')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    tenants: computed(() => tenants.value),
    currentTenant: computed(() => currentTenant.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isEmpty,
    fetchTenants,
    fetchTenant,
    createTenant,
    updateTenant,
    deleteTenant,
  }
}
