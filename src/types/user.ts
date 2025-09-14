import { z } from 'zod'

export const UserRoleEnum = z.enum(['user', 'admin'])
export type UserRole = z.infer<typeof UserRoleEnum>

// Raw record as it may come from API (ensuring robustness with types)
export const UserRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().min(1),
  email: z.string().email(),
  role: UserRoleEnum.default('user'),
  isEmailVerified: z.coerce.boolean().default(false),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserRecordSchema>

// For creating a new user (client-side payload)
export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  role: UserRoleEnum.optional().default('user'),
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>

// For updating a user (password optional)
export const UpdateUserSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(), // Legacy field for backward compatibility
  currentPassword: z.string().min(1).optional(), // Current password for validation
  newPassword: z.string().min(6).optional(), // New password to set
  role: UserRoleEnum.optional(),
  isEmailVerified: z.boolean().optional(),
})

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
