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
    } catch (err) {
      error.value = 'Failed to fetch payments'
      tError('Error', 'Failed to fetch payments')
    } finally {
      loading.value = false
    }
  }

  const fetchPayment = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentPayment.value = await paymentService.getPayment(id)
    } catch (err) {
      error.value = 'Failed to fetch payment'
      tError('Error', 'Failed to fetch payment')
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
    } catch (err) {
      error.value = 'Failed to create payment'
      tError('Error', 'Failed to create payment')
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
    } catch (err) {
      error.value = 'Failed to update payment'
      tError('Error', 'Failed to update payment')
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
    } catch (err) {
      error.value = 'Failed to delete payment'
      tError('Error', 'Failed to delete payment')
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
