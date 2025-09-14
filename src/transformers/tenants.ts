import { z } from 'zod'
import {
  TenantRecordSchema,
  type Tenant,
  type CreateTenantInput,
  type UpdateTenantInput,
} from '@/types/tenant'

const ApiTenantSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  idNumber: z.string().nullable().optional(),
  createdAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  updatedAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  permanentAddress: z.string().nullable().optional(),
  nationalIdNumber: z.string().nullable().optional(),
  emergencyContactName: z.string().nullable().optional(),
  emergencyContactPhone: z.string().nullable().optional(),
  emergencyContactRelation: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  gender: z.enum(['male', 'female', 'other']).nullable().optional(),
  dateOfBirth: z
    .union([z.string(), z.date()])
    .transform((v) => (v ? new Date(v as any) : null))
    .nullable()
    .optional(),
})

export type ApiTenant = z.infer<typeof ApiTenantSchema>

export function transformApiTenantToTenant(record: unknown): Tenant {
  const parsed = ApiTenantSchema.parse(record)
  return TenantRecordSchema.parse(parsed)
}

export function transformApiTenantsToTenants(records: unknown[]): Tenant[] {
  return records.map(transformApiTenantToTenant)
}

export function transformCreateTenantToApi(payload: CreateTenantInput) {
  return {
    fullName: payload.fullName,
    phone: payload.phone ?? null,
    email: payload.email ?? null,
    idNumber: payload.idNumber ?? null,
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
    idNumber: payload.idNumber,
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
