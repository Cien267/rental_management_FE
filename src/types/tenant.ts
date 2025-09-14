import { z } from 'zod'

export const GenderEnum = z.enum(['male', 'female', 'other'])
export type Gender = z.infer<typeof GenderEnum>

export const TenantRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  fullName: z.string().min(1),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  idNumber: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  permanentAddress: z.string().nullable().optional(),
  nationalIdNumber: z.string().nullable().optional(),
  emergencyContactName: z.string().nullable().optional(),
  emergencyContactPhone: z.string().nullable().optional(),
  emergencyContactRelation: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  gender: GenderEnum.nullable().optional(),
  dateOfBirth: z
    .union([z.string(), z.date()])
    .transform((v) => (v ? new Date(v as any) : null))
    .nullable()
    .optional(),
})

export type Tenant = z.infer<typeof TenantRecordSchema>

export const CreateTenantSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  idNumber: z.string().optional(),
  permanentAddress: z.string().optional(),
  nationalIdNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  occupation: z.string().optional(),
  note: z.string().optional(),
  gender: GenderEnum.optional(),
  dateOfBirth: z.union([z.string(), z.date()]).optional(),
})

export type CreateTenantInput = z.infer<typeof CreateTenantSchema>

export const UpdateTenantSchema = z.object({
  id: z.number().int(),
  fullName: z.string().min(1).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  idNumber: z.string().optional(),
  permanentAddress: z.string().optional(),
  nationalIdNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  occupation: z.string().optional(),
  note: z.string().optional(),
  gender: GenderEnum.optional().nullable(),
  dateOfBirth: z.union([z.string(), z.date()]).optional(),
})

export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>
