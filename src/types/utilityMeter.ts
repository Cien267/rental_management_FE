import { z } from 'zod'

export const MeterTypeEnum = z.enum(['electricity', 'water'])
export type MeterType = z.infer<typeof MeterTypeEnum>

export const UtilityMeterRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  propertyId: z.number().int().nonnegative(),
  meterType: MeterTypeEnum,
  roomId: z.number().int().nullable().optional(),
  active: z.coerce.boolean().default(true),
  unit: z.string().default('kWh'),
  notes: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UtilityMeter = z.infer<typeof UtilityMeterRecordSchema>

export const CreateUtilityMeterSchema = z.object({
  propertyId: z.number().int(),
  meterType: MeterTypeEnum,
  roomId: z.number().int().nullable().optional(),
  active: z.boolean().optional().default(true),
  unit: z.string().optional().default('kWh'),
  notes: z.string().optional(),
})

export type CreateUtilityMeterInput = z.infer<typeof CreateUtilityMeterSchema>

export const UpdateUtilityMeterSchema = z.object({
  id: z.number().int(),
  propertyId: z.number().int().optional(),
  meterType: MeterTypeEnum.optional(),
  roomId: z.number().int().nullable().optional(),
  active: z.boolean().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
})

export type UpdateUtilityMeterInput = z.infer<typeof UpdateUtilityMeterSchema>
