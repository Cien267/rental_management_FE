import { ref, computed } from 'vue'
import { useCustomToast } from '@/composables/base/useCustomToast'
import * as paymentService from '@/services/api/paymentService'
import type { Payment, CreatePaymentInput, UpdatePaymentInput } from '@/types/payment'

export const usePayment = () => {
  const { tSuccess, tError } = useCustomToast()

  const payments = ref<Payment[]>([])
  const currentPayment = ref<Payment | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isEmpty = computed(() => !loading.value && payments.value.length === 0)

  const fetchPayments = async (invoiceId?: number) => {
    loading.value = true
    error.value = null
    try {
      payments.value = await paymentService.getPayments(invoiceId)
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to fetch payments'
      error.value = eMsg
      tError('Error', eMsg)
    } finally {
      loading.value = false
    }
  }

  const fetchPayment = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentPayment.value = await paymentService.getPayment(id)
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to fetch payment'
      error.value = eMsg
      tError('Error', eMsg)
    } finally {
      loading.value = false
    }
  }

  const createPayment = async (paymentData: CreatePaymentInput, invoiceId?: number) => {
    loading.value = true
    error.value = null
    try {
      const newPayment = await paymentService.createPayment(paymentData, invoiceId)
      payments.value.push(newPayment)
      tSuccess('Success', 'Payment created successfully')
      return newPayment
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to create payment'
      error.value = eMsg
      tError('Error', eMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePayment = async (id: number, paymentData: UpdatePaymentInput) => {
    loading.value = true
    error.value = null
    try {
      const updatedPayment = await paymentService.updatePayment(id, paymentData)
      const index = payments.value.findIndex((payment) => payment.id === id)
      if (index !== -1) {
        payments.value[index] = updatedPayment
      }
      if (currentPayment.value?.id === id) {
        currentPayment.value = updatedPayment
      }
      tSuccess('Success', 'Payment updated successfully')
      return updatedPayment
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to update payment'
      error.value = eMsg
      tError('Error', eMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePayment = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await paymentService.deletePayment(id)
      payments.value = payments.value.filter((payment) => payment.id !== id)
      if (currentPayment.value?.id === id) {
        currentPayment.value = null
      }
      tSuccess('Success', 'Payment deleted successfully')
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to delete payment'
      error.value = eMsg
      tError('Error', eMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    payments: computed(() => payments.value),
    currentPayment: computed(() => currentPayment.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isEmpty,
    fetchPayments,
    fetchPayment,
    createPayment,
    updatePayment,
    deletePayment,
  }
}
