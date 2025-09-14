import { ref, computed } from 'vue'
import { useCustomToast } from '@/composables/base/useCustomToast'
import * as invoiceService from '@/services/api/invoiceService'
import type { Invoice, CreateInvoiceInput, UpdateInvoiceInput } from '@/types/invoice'

export const useInvoice = () => {
  const { tSuccess, tError } = useCustomToast()

  const invoices = ref<Invoice[]>([])
  const currentInvoice = ref<Invoice | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isEmpty = computed(() => !loading.value && invoices.value.length === 0)

  const fetchInvoices = async () => {
    loading.value = true
    error.value = null
    try {
      invoices.value = await invoiceService.getInvoices()
    } catch (err) {
      error.value = 'Failed to fetch invoices'
      tError('Error', 'Failed to fetch invoices')
    } finally {
      loading.value = false
    }
  }

  const fetchInvoice = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentInvoice.value = await invoiceService.getInvoice(id)
    } catch (err) {
      error.value = 'Failed to fetch invoice'
      tError('Error', 'Failed to fetch invoice')
    } finally {
      loading.value = false
    }
  }

  const createInvoice = async (invoiceData: CreateInvoiceInput) => {
    loading.value = true
    error.value = null
    try {
      const newInvoice = await invoiceService.createInvoice(invoiceData)
      invoices.value.push(newInvoice)
      tSuccess('Success', 'Invoice created successfully')
      return newInvoice
    } catch (err) {
      error.value = 'Failed to create invoice'
      tError('Error', 'Failed to create invoice')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateInvoice = async (id: number, invoiceData: UpdateInvoiceInput) => {
    loading.value = true
    error.value = null
    try {
      const updatedInvoice = await invoiceService.updateInvoice(id, invoiceData)
      const index = invoices.value.findIndex((invoice) => invoice.id === id)
      if (index !== -1) {
        invoices.value[index] = updatedInvoice
      }
      if (currentInvoice.value?.id === id) {
        currentInvoice.value = updatedInvoice
      }
      tSuccess('Success', 'Invoice updated successfully')
      return updatedInvoice
    } catch (err) {
      error.value = 'Failed to update invoice'
      tError('Error', 'Failed to update invoice')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteInvoice = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await invoiceService.deleteInvoice(id)
      invoices.value = invoices.value.filter((invoice) => invoice.id !== id)
      if (currentInvoice.value?.id === id) {
        currentInvoice.value = null
      }
      tSuccess('Success', 'Invoice deleted successfully')
    } catch (err) {
      error.value = 'Failed to delete invoice'
      tError('Error', 'Failed to delete invoice')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    invoices: computed(() => invoices.value),
    currentInvoice: computed(() => currentInvoice.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isEmpty,
    fetchInvoices,
    fetchInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  }
}
