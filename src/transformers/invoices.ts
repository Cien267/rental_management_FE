import { z } from 'zod'
import {
  InvoiceRecordSchema,
  type Invoice,
  type CreateInvoiceInput,
  type UpdateInvoiceInput,
} from '@/types/invoice'
import { INVOICE_STATUSES, INVOICE_STATUS_SEVERITIES } from '@/constants/invoices'

const ApiInvoiceSchema = z.object({
  id: z.number(),
  contractId: z.number(),
  month: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  year: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  rentAmount: z
    .union([z.number(), z.string()])
    .transform((v) => Number(v))
    .default(0),
  status: z.enum(['unpaid', 'partially_paid', 'paid', 'overdue']).default('unpaid'),
  createdAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  updatedAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  invoiceDate: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  periodStart: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  periodEnd: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  utilitiesAmount: z
    .union([z.number(), z.string()])
    .transform((v) => Number(v))
    .default(0),
  extraFeesAmount: z
    .union([z.number(), z.string()])
    .transform((v) => Number(v))
    .default(0),
  notes: z.string().nullable().optional(),
  totalAmount: z
    .union([z.number(), z.string()])
    .transform((v) => Number(v))
    .default(0),
  utilitiesBreakdown: z.string().nullable().optional(),
  extraFeesBreakdown: z.string().nullable().optional(),
})

export type ApiInvoice = z.infer<typeof ApiInvoiceSchema>

export function transformApiInvoiceToInvoice(record: unknown): Invoice {
  const parsed = ApiInvoiceSchema.parse(record)
  return InvoiceRecordSchema.parse(parsed)
}

export function transformApiInvoicesToInvoices(records: unknown[]): Invoice[] {
  return records.map(transformApiInvoiceToInvoice)
}

export function transformCreateInvoiceToApi(payload: CreateInvoiceInput) {
  return {
    contractId: payload.contractId,
    month: payload.month,
    year: payload.year,
    rentAmount: payload.rentAmount ?? 0,
    status: payload.status ?? 'unpaid',
    invoiceDate: payload.invoiceDate ?? undefined,
    periodStart: payload.periodStart,
    periodEnd: payload.periodEnd,
    utilitiesAmount: payload.utilitiesAmount ?? 0,
    extraFeesAmount: payload.extraFeesAmount ?? 0,
    notes: payload.notes ?? null,
  }
}

export function transformUpdateInvoiceToApi(payload: UpdateInvoiceInput) {
  return {
    contractId: payload.contractId,
    month: payload.month,
    year: payload.year,
    rentAmount: payload.rentAmount,
    status: payload.status,
    invoiceDate: payload.invoiceDate,
    periodStart: payload.periodStart,
    periodEnd: payload.periodEnd,
    utilitiesAmount: payload.utilitiesAmount,
    extraFeesAmount: payload.extraFeesAmount,
    notes: payload.notes,
  }
}

export const getInvoiceStatusValue = (status: string) => {
  return INVOICE_STATUSES[status as keyof typeof INVOICE_STATUSES] || '---'
}

export const getInvoiceStatusSeverity = (status: string) => {
  return INVOICE_STATUS_SEVERITIES[status as keyof typeof INVOICE_STATUS_SEVERITIES] || 'info'
}
