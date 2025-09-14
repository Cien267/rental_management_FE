import { z } from 'zod'
import {
  PaymentRecordSchema,
  type Payment,
  type CreatePaymentInput,
  type UpdatePaymentInput,
} from '@/types/payment'

const ApiPaymentSchema = z.object({
  id: z.number(),
  invoiceId: z.number(),
  amount: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  method: z.enum(['cash', 'bank_transfer', 'online']).default('cash'),
  transactionCode: z.string().nullable().optional(),
  paidAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  createdAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  updatedAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
})

export type ApiPayment = z.infer<typeof ApiPaymentSchema>

export function transformApiPaymentToPayment(record: unknown): Payment {
  const parsed = ApiPaymentSchema.parse(record)
  return PaymentRecordSchema.parse(parsed)
}

export function transformApiPaymentsToPayments(records: unknown[]): Payment[] {
  return records.map(transformApiPaymentToPayment)
}

export function transformCreatePaymentToApi(payload: CreatePaymentInput) {
  return {
    invoiceId: payload.invoiceId,
    amount: payload.amount,
    method: payload.method ?? 'cash',
    transactionCode: payload.transactionCode ?? null,
    paidAt: payload.paidAt,
  }
}

export function transformUpdatePaymentToApi(payload: UpdatePaymentInput) {
  return {
    invoiceId: payload.invoiceId,
    amount: payload.amount,
    method: payload.method,
    transactionCode: payload.transactionCode,
    paidAt: payload.paidAt,
  }
}
