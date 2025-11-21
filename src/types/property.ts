import { z } from 'zod'
import type { Room } from './room'
import type { Tenant } from './tenant'
import type { Contract } from './contract'

export const PropertyStatusEnum = z.enum(['inactive', 'active', 'maintenance'])
export type PropertyStatus = z.infer<typeof PropertyStatusEnum>

// Record as used in app after normalization
export const PropertyRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  userId: z.number().int().nonnegative(),
  name: z.string().min(1),
  address: z.string().optional(),
  type: z.string().optional(),
  floors: z.number().int().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  image: z.string().optional().nullable(),
  status: PropertyStatusEnum.default('active'),
  code: z.string().default(''),
  note: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactMail: z.string().email().optional().nullable(),
  electricityPricePerKwh: z.number().optional(),
  waterPricePerM3: z.number().optional(),
  rooms: z.any().nullable(),
  tenants: z.any().nullable(),
})

export type Property = z.infer<typeof PropertyRecordSchema>

export const CreatePropertySchema = z.object({
  userId: z.number().int(),
  name: z.string().min(1, 'Tên không được để trống'),
  address: z.string().optional(),
  type: z.string().optional(),
  floors: z.number().int().optional().nullable(),
  image: z.string().optional().nullable(),
  status: PropertyStatusEnum.optional(),
  code: z.string().optional(),
  note: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactMail: z.string().email().optional().nullable(),
  electricityPricePerKwh: z.number().optional(),
  waterPricePerM3: z.number().optional(),
})

export type CreatePropertyInput = z.infer<typeof CreatePropertySchema>

export const UpdatePropertySchema = z.object({
  id: z.number().int(),
  userId: z.number().int().optional(),
  name: z.string().min(1).optional(),
  address: z.string().optional(),
  type: z.string().optional(),
  floors: z.number().int().optional().nullable(),
  image: z.string().optional().nullable(),
  status: PropertyStatusEnum.optional(),
  code: z.string().optional(),
  note: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactMail: z.string().email().optional().nullable(),
  electricityPricePerKwh: z.number().optional(),
  waterPricePerM3: z.number().optional(),
})

export type UpdatePropertyInput = z.infer<typeof UpdatePropertySchema>

// UI Property type with computed fields for display
export interface PropertyUI extends Property {
  totalRooms?: number
  occupiedRooms?: number
  occupancyPercent?: number
  statusLabel?: string
  statusSeverity?: 'success' | 'warn' | 'danger' | 'secondary'
  occupancyBgColor?: string
}

// Dashboard (overview) data types
export interface PropertyDashboardUnpaidInvoiceItem {
  id: number
  contractId: number
  invoiceDate: string
  periodStart: string
  periodEnd: string
  totalAmount: number
  status: string
  contract?: Contract
}

export interface PropertyDashboardExpiringContractItem {
  id: number
  roomId: number
  tenantId: number
  startDate: string
  endDate: string
  status: string
  room?: Room
  tenant?: Tenant
}

export interface PropertyDashboardResponse {
  stats: {
    totalRooms: number
    occupancyRate: number
    rentedRooms: number
  }
  general: {
    totalRooms: number
    occupancyRate: number
    propertyName: string
    propertyCode: string
    propertyAddress: string
    propertyStatus: number
  }
  monthlyRevenue: number
  monthlyRevenueChangePercent: number
  roomStatus: {
    totalRooms: number
    rentedRooms: number
    availableRooms: number
    maintenanceRooms: number
    occupancyRate: number
  }
  attentionRequired: {
    unpaidInvoices: PropertyDashboardUnpaidInvoiceItem[]
    expiringContracts: PropertyDashboardExpiringContractItem[]
  }
}
