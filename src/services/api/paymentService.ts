import { get, post, patch, del } from '@/helpers/axios'
import { PAYMENT_URLS } from '@/constants/urls'
import {
  transformApiPaymentsToPayments,
  transformApiPaymentToPayment,
  transformCreatePaymentToApi,
  transformUpdatePaymentToApi,
} from '@/transformers/payments'
import type { Payment, CreatePaymentInput, UpdatePaymentInput } from '@/types/payment'

export const getPayments = async (invoiceId?: number): Promise<Payment[]> => {
  const response = await get(PAYMENT_URLS.URL_LIST(invoiceId))
  return transformApiPaymentsToPayments(response.data.data)
}

export const getPayment = async (id: number): Promise<Payment> => {
  const response = await get(PAYMENT_URLS.URL_DETAIL(id))
  return transformApiPaymentToPayment(response.data.data)
}

export const createPayment = async (
  paymentData: CreatePaymentInput,
  invoiceId?: number,
): Promise<Payment> => {
  const response = await post(
    PAYMENT_URLS.URL_CREATE(invoiceId),
    transformCreatePaymentToApi(paymentData),
  )
  return transformApiPaymentToPayment(response.data.data)
}

export const updatePayment = async (
  id: number,
  paymentData: UpdatePaymentInput,
): Promise<Payment> => {
  const response = await patch(
    PAYMENT_URLS.URL_UPDATE(id),
    transformUpdatePaymentToApi({ ...paymentData, id }),
  )
  return transformApiPaymentToPayment(response.data.data)
}

export const deletePayment = async (id: number): Promise<void> => {
  await del(PAYMENT_URLS.URL_DELETE(id))
}
