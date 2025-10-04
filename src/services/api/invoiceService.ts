import { get, post, patch, del } from '@/helpers/axios'
import { INVOICE_URLS } from '@/constants/urls'
import {
  transformApiInvoicesToInvoices,
  transformApiInvoiceToInvoice,
  transformCreateInvoiceToApi,
  transformUpdateInvoiceToApi,
} from '@/transformers/invoices'
import type { Invoice, CreateInvoiceInput } from '@/types/invoice'

export const getInvoices = async (
  propertyId?: number,
  params?: { limit?: number; page?: number; sortBy?: string },
): Promise<{
  results: Invoice[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
}> => {
  const response = await get(INVOICE_URLS.URL_LIST(propertyId), { params })
  return {
    results: transformApiInvoicesToInvoices(response.data.results),
    page: response.data.page,
    limit: response.data.limit,
    totalPages: response.data.totalPages,
    totalResults: response.data.totalResults,
  }
}

export const getInvoice = async (id: number, propertyId?: number): Promise<Invoice> => {
  const response = await get(INVOICE_URLS.URL_DETAIL(id, propertyId))
  return transformApiInvoiceToInvoice(response.data)
}

export const createInvoice = async (
  invoiceData: CreateInvoiceInput,
  propertyId?: number,
): Promise<Invoice> => {
  const response = await post(
    INVOICE_URLS.URL_CREATE(propertyId),
    transformCreateInvoiceToApi(invoiceData),
  )
  return transformApiInvoiceToInvoice(response.data)
}

export const updateInvoice = async (
  id: number,
  invoiceData: any,
  propertyId?: number,
): Promise<Invoice> => {
  const response = await patch(
    INVOICE_URLS.URL_UPDATE(id, propertyId),
    transformUpdateInvoiceToApi({ ...invoiceData, id }),
  )
  return transformApiInvoiceToInvoice(response.data)
}

export const deleteInvoice = async (id: number, propertyId?: number): Promise<void> => {
  await del(INVOICE_URLS.URL_DELETE(id, propertyId))
}
