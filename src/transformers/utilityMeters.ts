import { z } from 'zod'
import {
  UtilityMeterRecordSchema,
  type UtilityMeter,
  type CreateUtilityMeterInput,
  type UpdateUtilityMeterInput,
} from '@/types/utilityMeter'

const ApiUtilityMeterSchema = z.object({
  id: z.number(),
  propertyId: z.number(),
  meterType: z.enum(['electricity', 'water']),
  roomId: z
    .union([z.number(), z.string()])
    .transform((v) => (v === null || v === undefined || v === '' ? null : Number(v)))
    .nullable()
    .optional(),
  active: z.union([z.boolean(), z.number(), z.string()]).transform((val) => {
    if (typeof val === 'boolean') return val
    if (typeof val === 'number') return val === 1
    const normalized = String(val).toLowerCase()
    return normalized === 'true' || normalized === '1' || normalized === 'yes'
  }),
  unit: z.string().default('kWh'),
  notes: z.string().nullable().optional(),
  createdAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  updatedAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
})

export type ApiUtilityMeter = z.infer<typeof ApiUtilityMeterSchema>

export function transformApiUtilityMeterToUtilityMeter(record: unknown): UtilityMeter {
  const parsed = ApiUtilityMeterSchema.parse(record)
  return UtilityMeterRecordSchema.parse(parsed)
}

export function transformApiUtilityMetersToUtilityMeters(records: unknown[]): UtilityMeter[] {
  return records.map(transformApiUtilityMeterToUtilityMeter)
}

export function transformCreateUtilityMeterToApi(payload: CreateUtilityMeterInput) {
  return {
    propertyId: payload.propertyId,
    meterType: payload.meterType,
    roomId: payload.roomId ?? null,
    active: payload.active ?? true,
    unit: payload.unit ?? 'kWh',
    notes: payload.notes ?? null,
  }
}

export function transformUpdateUtilityMeterToApi(payload: UpdateUtilityMeterInput) {
  return {
    propertyId: payload.propertyId,
    meterType: payload.meterType,
    roomId: payload.roomId,
    active: payload.active,
    unit: payload.unit,
    notes: payload.notes,
  }
}
