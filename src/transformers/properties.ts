import { z } from 'zod'
import {
  PropertyRecordSchema,
  type Property,
  type CreatePropertyInput,
  type UpdatePropertyInput,
  type PropertyUI,
} from '@/types/property'

// Map status from numeric DB value to app enum
function mapStatusToEnum(status: unknown): 'inactive' | 'active' | 'maintenance' {
  const n = Number(status)
  if (n === 1) return 'active'
  if (n === 2) return 'maintenance'
  return 'inactive'
}

const ApiPropertySchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  address: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === '' ? null : v)),
  type: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === '' ? null : v)),
  floors: z
    .union([z.number(), z.string()])
    .transform((v) => (v === null || v === undefined || v === '' ? null : Number(v)))
    .nullable()
    .optional(),
  createdAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  updatedAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  image: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === '' ? null : v)),
  status: z.union([z.number(), z.string()]).optional(),
  code: z.string().default(''),
  note: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === '' ? null : v)),
  contactName: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === '' ? null : v)),
  contactPhone: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === '' ? null : v)),
  contactMail: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === '' ? null : v)),
  electricityPricePerKwh: z
    .union([z.string(), z.number()])
    .transform((v) => (v === null || v === undefined || v === '' ? null : Number(v)))
    .nullable()
    .optional(),
  waterPricePerM3: z
    .union([z.string(), z.number()])
    .transform((v) => (v === null || v === undefined || v === '' ? null : Number(v)))
    .nullable()
    .optional(),
})

export type ApiProperty = z.infer<typeof ApiPropertySchema>

export function transformApiPropertyToProperty(record: unknown): Property {
  const parsed = ApiPropertySchema.parse(record)
  return PropertyRecordSchema.parse({
    ...parsed,
    status: mapStatusToEnum(parsed.status),
  })
}

export function transformApiPropertiesToProperties(records: unknown[]): Property[] {
  return records.map(transformApiPropertyToProperty)
}

// Requests
function mapStatusToNumber(status?: 'inactive' | 'active' | 'maintenance'): number | undefined {
  if (status === 'active') return 1
  if (status === 'maintenance') return 2
  if (status === 'inactive') return 0
  return undefined
}

export function transformCreatePropertyToApi(payload: CreatePropertyInput) {
  return {
    userId: payload.userId,
    name: payload.name,
    address: payload.address ?? null,
    type: payload.type ?? null,
    floors: payload.floors ?? null,
    image: payload.image ?? null,
    status: mapStatusToNumber(payload.status),
    code: payload.code ?? '',
    note: payload.note ?? null,
    contactName: payload.contactName ?? null,
    contactPhone: payload.contactPhone ?? null,
    contactMail: payload.contactMail ?? null,
    electricityPricePerKwh: payload.electricityPricePerKwh ?? null,
    waterPricePerM3: payload.waterPricePerM3 ?? null,
  }
}

export function transformUpdatePropertyToApi(payload: UpdatePropertyInput) {
  return {
    userId: payload.userId,
    name: payload.name,
    address: payload.address,
    type: payload.type,
    floors: payload.floors,
    image: payload.image,
    status: mapStatusToNumber(payload.status),
    code: payload.code,
    note: payload.note,
    contactName: payload.contactName,
    contactPhone: payload.contactPhone,
    contactMail: payload.contactMail,
    electricityPricePerKwh: payload.electricityPricePerKwh,
    waterPricePerM3: payload.waterPricePerM3,
  }
}

// UI utility functions
function getStatusLabel(status: 'inactive' | 'active' | 'maintenance'): string {
  switch (status) {
    case 'active':
      return 'Hoạt động'
    case 'maintenance':
      return 'Bảo trì'
    case 'inactive':
      return 'Không hoạt động'
    default:
      return status
  }
}

function getStatusSeverity(
  status: 'inactive' | 'active' | 'maintenance',
): 'success' | 'warn' | 'danger' | 'secondary' {
  switch (status) {
    case 'active':
      return 'success'
    case 'maintenance':
      return 'warn'
    case 'inactive':
      return 'danger'
    default:
      return 'secondary'
  }
}

function getOccupancyBgColor(percent: number): string {
  if (percent < 25) return '#ef4444' // red-500
  if (percent < 50) return '#f97316' // orange-500
  if (percent < 75) return '#f59e0b' // amber-500
  if (percent < 90) return '#0ea5e9' // sky-500
  return '#10b981' // emerald-500
}

// Transform Property to PropertyUI with computed fields
export function transformPropertyToUI(
  property: Property,
  totalRooms: number = 0,
  occupiedRooms: number = 0,
): PropertyUI {
  const occupancyPercent = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  return {
    ...property,
    totalRooms,
    occupiedRooms,
    occupancyPercent,
    statusLabel: getStatusLabel(property.status),
    statusSeverity: getStatusSeverity(property.status),
    occupancyBgColor: getOccupancyBgColor(occupancyPercent),
  }
}

// Transform multiple properties to UI format
export function transformPropertiesToUI(
  properties: Property[],
  roomCounts: Record<number, { total: number; occupied: number }> = {},
): PropertyUI[] {
  return properties.map((property) => {
    const counts = roomCounts[property.id] || { total: 0, occupied: 0 }
    return transformPropertyToUI(property, counts.total, counts.occupied)
  })
}
