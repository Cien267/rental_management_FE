import { z } from 'zod'
import {
  UserRecordSchema,
  type User,
  type CreateUserInput,
  type UpdateUserInput,
} from '@/types/user'

// API response item schema (if API returns snake_case or strings for booleans/dates, normalize here)
const ApiUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['user', 'admin']).default('user'),
  isEmailVerified: z.union([z.boolean(), z.number(), z.string()]).transform((val) => {
    if (typeof val === 'boolean') return val
    if (typeof val === 'number') return val === 1
    const normalized = val.toLowerCase()
    return normalized === 'true' || normalized === '1' || normalized === 'yes'
  }),
  createdAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  updatedAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
})

export type ApiUser = z.infer<typeof ApiUserSchema>

export function transformApiUserToUser(record: unknown): User {
  const parsed = ApiUserSchema.parse(record)
  return UserRecordSchema.parse(parsed)
}

export function transformApiUsersToUsers(records: unknown[]): User[] {
  return records.map(transformApiUserToUser)
}

// For requests
export function transformCreateUserToApi(payload: CreateUserInput) {
  return {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role ?? 'user',
  }
}

export function transformUpdateUserToApi(payload: UpdateUserInput) {
  const result: any = {
    name: payload.name,
    email: payload.email,
    role: payload.role,
    isEmailVerified: payload.isEmailVerified,
  }

  // Handle password change - send both current and new password
  if (payload.currentPassword && payload.newPassword) {
    result.currentPassword = payload.currentPassword
    result.newPassword = payload.newPassword
  } else if (payload.password) {
    // Legacy support for direct password update
    result.password = payload.password
  }

  return result
}
