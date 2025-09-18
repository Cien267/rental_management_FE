import { z } from 'zod'

export const RoomStatusEnum = z.enum(['available', 'occupied', 'maintenance'])
export type RoomStatus = z.infer<typeof RoomStatusEnum>

export const RoomRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  propertyId: z.number().int().nonnegative(),
  name: z.string().min(1),
  floor: z.number().int().optional(),
  area: z.number().optional(),
  price: z.number(),
  status: RoomStatusEnum.default('available'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  amenities: z.string().optional(),
  maxOccupants: z.number().int().default(1),
  currentOccupants: z.number().int().default(0),
  note: z.string().optional(),
})

export type Room = z.infer<typeof RoomRecordSchema>

export const CreateRoomSchema = z.object({
  propertyId: z.number().int(),
  name: z.string().min(1, 'Tên không được để trống'),
  floor: z.number().int().optional(),
  area: z.number().optional(),
  price: z.number().nonnegative(),
  status: RoomStatusEnum.optional().default('available'),
  amenities: z.string().optional(),
  maxOccupants: z.number().int().min(1).optional(),
  note: z.string().optional(),
})

export type CreateRoomInput = z.infer<typeof CreateRoomSchema>

export const UpdateRoomSchema = z.object({
  id: z.number().int(),
  propertyId: z.number().int().optional(),
  name: z.string().min(1).optional(),
  floor: z.number().int().optional(),
  area: z.number().optional(),
  price: z.number().nonnegative().optional(),
  status: RoomStatusEnum.optional(),
  amenities: z.string().optional(),
  maxOccupants: z.number().int().min(1).optional(),
  currentOccupants: z.number().int().min(0).optional(),
  note: z.string().optional(),
})

export type UpdateRoomInput = z.infer<typeof UpdateRoomSchema>
