import { z } from 'zod'

export const GenderEnum = z.enum(['male', 'female', 'other'])
export type Gender = z.infer<typeof GenderEnum>

export const TenantRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  fullName: z.string().min(1),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  roomId: z.number().int().nonnegative(),
  room: z.any().optional(),
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
  phone: z.string().nullable().nullable().optional(),
  email: z.string().email().nullable().nullable().optional(),
  roomId: z.number().int(),
  permanentAddress: z.string().nullable().nullable().optional(),
  nationalIdNumber: z.string().nullable().nullable().optional(),
  emergencyContactName: z.string().nullable().nullable().optional(),
  emergencyContactPhone: z.string().nullable().nullable().optional(),
  emergencyContactRelation: z.string().nullable().nullable().optional(),
  occupation: z.string().nullable().nullable().optional(),
  note: z.string().nullable().nullable().optional(),
  gender: GenderEnum.optional(),
  dateOfBirth: z.union([z.string(), z.date()]).nullable().nullable().optional(),
})

export type CreateTenantInput = z.infer<typeof CreateTenantSchema>

export const UpdateTenantSchema = z.object({
  id: z.number().int(),
  fullName: z.string().min(1).optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  roomId: z.number().int().nullable().optional(),
  permanentAddress: z.string().nullable().optional(),
  nationalIdNumber: z.string().nullable().optional(),
  emergencyContactName: z.string().nullable().optional(),
  emergencyContactPhone: z.string().nullable().optional(),
  emergencyContactRelation: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  gender: GenderEnum.optional().nullable(),
  dateOfBirth: z.union([z.string(), z.date()]).nullable().optional(),
})

export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>
