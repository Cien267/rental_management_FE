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
  propertyId: z.number(),
  roomId: z.number(),
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
  utilitiesBreakdown: z.any().nullable().optional(),
  extraFeesBreakdown: z.any().nullable().optional(),
  room: z.any().optional().nullable(),
  contract: z.any().optional().nullable(),
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
    roomId: payload.roomId,
    month: payload.month,
    year: payload.year,
    periodStart: payload.periodStart,
    periodEnd: payload.periodEnd,
    notes: payload.notes ?? '',
  }
}

export function transformUpdateInvoiceToApi(payload: UpdateInvoiceInput) {
  return {
    status: payload.status,
  }
}

export const getInvoiceStatusValue = (status: string) => {
  return INVOICE_STATUSES[status as keyof typeof INVOICE_STATUSES] || '---'
}

export const getInvoiceStatusSeverity = (status: string) => {
  return INVOICE_STATUS_SEVERITIES[status as keyof typeof INVOICE_STATUS_SEVERITIES] || 'info'
}
