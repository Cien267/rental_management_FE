import { z } from 'zod'

export const RoomStatusEnum = z.enum(['available', 'occupied', 'maintenance'])
export type RoomStatus = z.infer<typeof RoomStatusEnum>

export const RoomRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  propertyId: z.number().int().nonnegative(),
  name: z.string().min(1),
  floor: z.number().int().nullable().optional(),
  area: z.number().nullable().optional(),
  price: z.number(),
  status: RoomStatusEnum.default('available'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  amenities: z.string().nullable().optional(),
  maxOccupants: z.number().int().nullable().default(1),
  currentOccupants: z.number().int().nullable().default(0),
  note: z.string().nullable().optional(),
  tenants: z
    .array(z.any())
    .transform((arr) => (Array.isArray(arr) ? arr : []))
    .optional(),
})

export type Room = z.infer<typeof RoomRecordSchema>

export const CreateRoomSchema = z.object({
  propertyId: z.number().int(),
  name: z.string().min(1, 'Tên không được để trống'),
  floor: z.number().int().nullable().optional(),
  area: z.number().nullable().optional(),
  price: z.number().nonnegative(),
  status: RoomStatusEnum.optional().default('available'),
  amenities: z.string().nullable().optional(),
  maxOccupants: z.number().int().min(1).nullable().optional(),
  note: z.string().nullable().optional(),
})

export type CreateRoomInput = z.infer<typeof CreateRoomSchema>

export const UpdateRoomSchema = z.object({
  id: z.number().int(),
  propertyId: z.number().int().optional(),
  name: z.string().min(1).optional(),
  floor: z.number().int().nullable().optional(),
  area: z.number().nullable().optional(),
  price: z.number().nonnegative().nullable().optional(),
  status: RoomStatusEnum.optional(),
  amenities: z.string().nullable().optional(),
  maxOccupants: z.number().int().min(1).nullable().optional(),
  currentOccupants: z.number().int().min(0).nullable().optional(),
  note: z.string().nullable().optional(),
})

export type UpdateRoomInput = z.infer<typeof UpdateRoomSchema>
