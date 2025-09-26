import { z } from 'zod'
import {
  UtilityMeterReadingRecordSchema,
  type UtilityMeterReading,
  type CreateUtilityMeterReadingInput,
  type UpdateUtilityMeterReadingInput,
} from '@/types/utilityMeterReading'

const ApiUtilityMeterReadingSchema = z.object({
  id: z.number(),
  utilityMeterId: z.number(),
  readingDate: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  value: z
    .union([z.number(), z.string()])
    .transform((v) => (v === null || v === undefined || v === '' ? null : Number(v)))
    .nullable()
    .optional(),
  createdAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  updatedAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
})

export type ApiUtilityMeterReading = z.infer<typeof ApiUtilityMeterReadingSchema>

export function transformApiUtilityMeterReadingToUtilityMeterReading(
  record: unknown,
): UtilityMeterReading {
  const parsed = ApiUtilityMeterReadingSchema.parse(record)
  return UtilityMeterReadingRecordSchema.parse(parsed)
}

export function transformApiUtilityMeterReadingsToUtilityMeterReadings(
  records: unknown[],
): UtilityMeterReading[] {
  return records.map(transformApiUtilityMeterReadingToUtilityMeterReading)
}

export function transformCreateUtilityMeterReadingToApi(payload: CreateUtilityMeterReadingInput) {
  return {
    utilityMeterId: payload.utilityMeterId,
    readingDate: payload.readingDate,
    value: payload.value ?? null,
    propertyId: payload.propertyId,
    roomId: payload.roomId,
  }
}

export function transformUpdateUtilityMeterReadingToApi(payload: UpdateUtilityMeterReadingInput) {
  return {
    utilityMeterId: payload.utilityMeterId,
    readingDate: payload.readingDate,
    value: payload.value,
    propertyId: payload.propertyId,
    roomId: payload.roomId,
  }
}
