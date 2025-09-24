import { z } from 'zod'

export const UtilityMeterReadingRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  propertyId: z.number().int(),
  roomId: z.number().int(),
  utilityMeterId: z.number().int().nonnegative(),
  readingDate: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  value: z.number().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UtilityMeterReading = z.infer<typeof UtilityMeterReadingRecordSchema>

export const CreateUtilityMeterReadingSchema = z.object({
  propertyId: z.number().int(),
  roomId: z.number().int(),
  utilityMeterId: z.number().int(),
  readingDate: z.union([z.string(), z.date()]),
  value: z.number().optional(),
})

export type CreateUtilityMeterReadingInput = z.infer<typeof CreateUtilityMeterReadingSchema>

export const UpdateUtilityMeterReadingSchema = z.object({
  id: z.number().int(),
  propertyId: z.number().int(),
  roomId: z.number().int(),
  utilityMeterId: z.number().int().optional(),
  readingDate: z.union([z.string(), z.date()]).optional(),
  value: z.number().nullable().optional(),
})

export type UpdateUtilityMeterReadingInput = z.infer<typeof UpdateUtilityMeterReadingSchema>
