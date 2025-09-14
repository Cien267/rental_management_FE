import { z } from 'zod'
import {
  ExtraFeeRecordSchema,
  type ExtraFee,
  type CreateExtraFeeInput,
  type UpdateExtraFeeInput,
} from '@/types/extraFee'

const ApiExtraFeeSchema = z.object({
  id: z.number(),
  propertyId: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  amount: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  chargeType: z.enum(['monthly', 'one_time']).default('monthly'),
  isActive: z.union([z.boolean(), z.number(), z.string()]).transform((val) => {
    if (typeof val === 'boolean') return val
    if (typeof val === 'number') return val === 1
    const normalized = String(val).toLowerCase()
    return normalized === 'true' || normalized === '1' || normalized === 'yes'
  }),
  createdAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  updatedAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
})

export type ApiExtraFee = z.infer<typeof ApiExtraFeeSchema>

export function transformApiExtraFeeToExtraFee(record: unknown): ExtraFee {
  const parsed = ApiExtraFeeSchema.parse(record)
  return ExtraFeeRecordSchema.parse(parsed)
}

export function transformApiExtraFeesToExtraFees(records: unknown[]): ExtraFee[] {
  return records.map(transformApiExtraFeeToExtraFee)
}

export function transformCreateExtraFeeToApi(payload: CreateExtraFeeInput) {
  return {
    propertyId: payload.propertyId,
    name: payload.name,
    description: payload.description ?? null,
    amount: payload.amount,
    chargeType: payload.chargeType ?? 'monthly',
    isActive: payload.isActive ?? true,
  }
}

export function transformUpdateExtraFeeToApi(payload: UpdateExtraFeeInput) {
  return {
    propertyId: payload.propertyId,
    name: payload.name,
    description: payload.description,
    amount: payload.amount,
    chargeType: payload.chargeType,
    isActive: payload.isActive,
  }
}
