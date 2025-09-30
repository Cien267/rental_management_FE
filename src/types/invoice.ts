import { z } from 'zod'

export const InvoiceStatusEnum = z.enum(['unpaid', 'partially_paid', 'paid', 'overdue'])
export type InvoiceStatus = z.infer<typeof InvoiceStatusEnum>

export const InvoiceRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  contractId: z.number().int().nonnegative(),
  month: z.number().int(),
  year: z.number().int(),
  rentAmount: z.number().default(0),
  status: InvoiceStatusEnum.default('unpaid'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  invoiceDate: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  periodStart: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  periodEnd: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  utilitiesAmount: z.number().default(0),
  utilitiesBreakdown: z.string().nullable().optional(),
  extraFeesAmount: z.number().default(0),
  extraFeesBreakdown: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  totalAmount: z.number().default(0),
})

export type Invoice = z.infer<typeof InvoiceRecordSchema>

export const CreateInvoiceSchema = z.object({
  contractId: z.number().int(),
  month: z.number().int(),
  year: z.number().int(),
  rentAmount: z.number().nonnegative().optional(),
  status: InvoiceStatusEnum.optional(),
  invoiceDate: z.union([z.string(), z.date()]).optional(),
  periodStart: z.union([z.string(), z.date()]),
  periodEnd: z.union([z.string(), z.date()]),
  utilitiesAmount: z.number().nonnegative().optional(),
  extraFeesAmount: z.number().nonnegative().optional(),
  notes: z.string().optional(),
})

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>

export const UpdateInvoiceSchema = z.object({
  id: z.number().int(),
  contractId: z.number().int().optional(),
  month: z.number().int().optional(),
  year: z.number().int().optional(),
  rentAmount: z.number().nonnegative().optional(),
  status: InvoiceStatusEnum.optional(),
  invoiceDate: z.union([z.string(), z.date()]).optional(),
  periodStart: z.union([z.string(), z.date()]).optional(),
  periodEnd: z.union([z.string(), z.date()]).optional(),
  utilitiesAmount: z.number().nonnegative().optional(),
  extraFeesAmount: z.number().nonnegative().optional(),
  notes: z.string().optional(),
})

export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceSchema>
