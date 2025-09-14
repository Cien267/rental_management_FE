import { z } from 'zod'

export const PaymentMethodEnum = z.enum(['cash', 'bank_transfer', 'online'])
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>

export const PaymentRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  invoiceId: z.number().int().nonnegative(),
  amount: z.number(),
  method: PaymentMethodEnum.default('cash'),
  transactionCode: z.string().nullable().optional(),
  paidAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Payment = z.infer<typeof PaymentRecordSchema>

export const CreatePaymentSchema = z.object({
  invoiceId: z.number().int(),
  amount: z.number().nonnegative(),
  method: PaymentMethodEnum.optional().default('cash'),
  transactionCode: z.string().optional(),
  paidAt: z.union([z.string(), z.date()]),
})

export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>

export const UpdatePaymentSchema = z.object({
  id: z.number().int(),
  invoiceId: z.number().int().optional(),
  amount: z.number().nonnegative().optional(),
  method: PaymentMethodEnum.optional(),
  transactionCode: z.string().optional(),
  paidAt: z.union([z.string(), z.date()]).optional(),
})

export type UpdatePaymentInput = z.infer<typeof UpdatePaymentSchema>
