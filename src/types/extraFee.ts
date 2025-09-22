import { z } from 'zod'

export const ChargeTypeEnum = z.enum(['monthly', 'one_time'])
export type ChargeType = z.infer<typeof ChargeTypeEnum>

export const ExtraFeeRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  propertyId: z.number().int().nonnegative(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  amount: z.number(),
  chargeType: ChargeTypeEnum.default('monthly'),
  isActive: z.coerce.boolean().default(true),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ExtraFee = z.infer<typeof ExtraFeeRecordSchema>

export const CreateExtraFeeSchema = z.object({
  propertyId: z.number().int(),
  name: z.string().min(1, 'Tên không được để trống'),
  description: z.string().nullable().optional(),
  amount: z.number().nonnegative(),
  chargeType: ChargeTypeEnum.optional().default('monthly'),
  isActive: z.boolean().optional().default(true),
})

export type CreateExtraFeeInput = z.infer<typeof CreateExtraFeeSchema>

export const UpdateExtraFeeSchema = z.object({
  id: z.number().int(),
  propertyId: z.number().int().optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  amount: z.number().nonnegative().optional(),
  chargeType: ChargeTypeEnum.optional(),
  isActive: z.boolean().optional(),
})

export type UpdateExtraFeeInput = z.infer<typeof UpdateExtraFeeSchema>
