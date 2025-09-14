import { get, post, patch, del } from '@/helpers/axios'
import { INVOICE_URLS } from '@/constants/urls'
import {
  transformApiInvoicesToInvoices,
  transformApiInvoiceToInvoice,
  transformCreateInvoiceToApi,
  transformUpdateInvoiceToApi,
} from '@/transformers/invoices'
import type { Invoice, CreateInvoiceInput, UpdateInvoiceInput } from '@/types/invoice'

export const getInvoices = async (): Promise<Invoice[]> => {
  const response = await get(INVOICE_URLS.URL_LIST)
  return transformApiInvoicesToInvoices(response.data.data)
}

export const getInvoice = async (id: number): Promise<Invoice> => {
  const response = await get(INVOICE_URLS.URL_DETAIL(id))
  return transformApiInvoiceToInvoice(response.data.data)
}

export const createInvoice = async (invoiceData: CreateInvoiceInput): Promise<Invoice> => {
  const response = await post(INVOICE_URLS.URL_CREATE, transformCreateInvoiceToApi(invoiceData))
  return transformApiInvoiceToInvoice(response.data.data)
}

export const updateInvoice = async (
  id: number,
  invoiceData: UpdateInvoiceInput,
): Promise<Invoice> => {
  const response = await patch(
    INVOICE_URLS.URL_UPDATE(id),
    transformUpdateInvoiceToApi({ ...invoiceData, id }),
  )
  return transformApiInvoiceToInvoice(response.data.data)
}

export const deleteInvoice = async (id: number): Promise<void> => {
  await del(INVOICE_URLS.URL_DELETE(id))
}
