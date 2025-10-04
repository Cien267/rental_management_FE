import { z } from 'zod'

export const InvoiceStatusEnum = z.enum(['unpaid', 'partially_paid', 'paid', 'overdue'])
export type InvoiceStatus = z.infer<typeof InvoiceStatusEnum>

export const InvoiceRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  contractId: z.number().int().nonnegative(),
  propertyId: z.number().int().nonnegative(),
  roomId: z.number().int().nonnegative().optional().nullable(),
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
  utilitiesBreakdown: z.any().nullable().optional(),
  extraFeesAmount: z.number().default(0),
  extraFeesBreakdown: z.any().nullable().optional(),
  notes: z.string().nullable().optional(),
  totalAmount: z.number().default(0),
})

export type Invoice = z.infer<typeof InvoiceRecordSchema>

export const CreateInvoiceSchema = z.object({
  propertyId: z.number().int(),
  roomId: z.number().int(),
  contractId: z.number().int().nullable().optional(),
  month: z.number().int().nullable(),
  year: z.number().int().nullable(),
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
  status: InvoiceStatusEnum.optional(),
})

export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceSchema>
