import { z } from 'zod'
import {
  TenantRecordSchema,
  type Tenant,
  type CreateTenantInput,
  type UpdateTenantInput,
} from '@/types/tenant'
import { TENANT_GENDERS, TENANT_GENDER_SEVERITIES } from '@/constants/tenants'

const ApiTenantSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  phone: z.string().optional(),
  email: z.string().nullable().optional(),
  roomId: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  room: z.any().optional(),
  createdAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  updatedAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  permanentAddress: z.string().optional(),
  nationalIdNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  occupation: z.string().optional(),
  note: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z
    .union([z.string().nullable(), z.date()])
    .transform((v) => (v ? new Date(v as any) : null))

    .optional(),
})

export type ApiTenant = z.infer<typeof ApiTenantSchema>

export function transformApiTenantToTenant(record: unknown): Tenant {
  try {
    const parsed = ApiTenantSchema.parse(record)
    return TenantRecordSchema.parse(parsed)
  } catch (e) {
    console.error('Failed to transform API tenant to Tenant:', e)
    return TenantRecordSchema.parse({} as any)
  }
}

export function transformApiTenantsToTenants(records: unknown[]): Tenant[] {
  return records.map(transformApiTenantToTenant)
}

export function transformCreateTenantToApi(payload: CreateTenantInput) {
  return {
    fullName: payload.fullName,
    phone: payload.phone ?? null,
    email: payload.email ?? null,
    roomId: payload.roomId,
    permanentAddress: payload.permanentAddress ?? null,
    nationalIdNumber: payload.nationalIdNumber ?? null,
    emergencyContactName: payload.emergencyContactName ?? null,
    emergencyContactPhone: payload.emergencyContactPhone ?? null,
    emergencyContactRelation: payload.emergencyContactRelation ?? null,
    occupation: payload.occupation ?? null,
    note: payload.note ?? null,
    gender: payload.gender ?? null,
    dateOfBirth: payload.dateOfBirth ?? null,
  }
}

export function transformUpdateTenantToApi(payload: UpdateTenantInput) {
  return {
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    roomId: payload.roomId,
    permanentAddress: payload.permanentAddress,
    nationalIdNumber: payload.nationalIdNumber,
    emergencyContactName: payload.emergencyContactName,
    emergencyContactPhone: payload.emergencyContactPhone,
    emergencyContactRelation: payload.emergencyContactRelation,
    occupation: payload.occupation,
    note: payload.note,
    gender: payload.gender,
    dateOfBirth: payload.dateOfBirth,
  }
}

export const getTenantGenderValue = (gender: string) => {
  return TENANT_GENDERS[gender as keyof typeof TENANT_GENDERS] || '---'
}

export const getTenantGenderSeverity = (gender: string) => {
  return TENANT_GENDER_SEVERITIES[gender as keyof typeof TENANT_GENDER_SEVERITIES] || 'info'
}
