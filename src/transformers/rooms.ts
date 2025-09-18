import { z } from 'zod'
import {
  RoomRecordSchema,
  type Room,
  type CreateRoomInput,
  type UpdateRoomInput,
} from '@/types/room'
import { RoomStatusEnum } from '@/types/room'
import { ROOM_STATUSES, ROOM_STATUS_SEVERITIES } from '@/constants/rooms'

const ApiRoomSchema = z.object({
  id: z.number(),
  propertyId: z.number(),
  name: z.string(),
  floor: z
    .union([z.number(), z.string()])
    .transform((v) => (v === null || v === undefined || v === '' ? null : Number(v)))
    .nullable()
    .optional(),
  area: z
    .union([z.number(), z.string()])
    .transform((v) => (v === null || v === undefined || v === '' ? null : Number(v)))
    .nullable()
    .optional(),
  price: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  status: RoomStatusEnum.default('available'),
  createdAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  updatedAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  amenities: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => {
      if (Array.isArray(v)) return v.join(', ')
      try {
        return typeof v === 'string' ? JSON.parse(v) : null
      } catch {
        return v
      }
    })
    .nullable()
    .optional(),
  maxOccupants: z
    .union([z.number(), z.string()])
    .transform((v) => Number(v))
    .default(1),
  currentOccupants: z
    .union([z.number(), z.string()])
    .transform((v) => Number(v))
    .default(0),
  note: z.string().nullable().optional(),
})

export type ApiRoom = z.infer<typeof ApiRoomSchema>

export function transformApiRoomToRoom(record: unknown): Room {
  const parsed = ApiRoomSchema.parse(record)
  return RoomRecordSchema.parse(parsed)
}

export function transformApiRoomsToRooms(records: unknown[]): Room[] {
  return records.map(transformApiRoomToRoom)
}

export function transformCreateRoomToApi(payload: CreateRoomInput) {
  return {
    propertyId: payload.propertyId,
    name: payload.name,
    floor: payload.floor ?? null,
    area: payload.area ?? null,
    price: payload.price,
    status: payload.status ?? 'available',
    amenities: payload.amenities ?? null,
    maxOccupants: payload.maxOccupants ?? 1,
    note: payload.note ?? null,
  }
}

export function transformUpdateRoomToApi(payload: UpdateRoomInput) {
  return {
    propertyId: payload.propertyId,
    name: payload.name,
    floor: payload.floor,
    area: payload.area,
    price: payload.price,
    status: payload.status,
    amenities: payload.amenities,
    maxOccupants: payload.maxOccupants,
    currentOccupants: payload.currentOccupants,
    note: payload.note,
  }
}

export const getRoomStatusValue = (status: string) => {
  return ROOM_STATUSES[status as keyof typeof ROOM_STATUSES] || '---'
}

export const getRoomStatusSeverity = (status: string) => {
  return ROOM_STATUS_SEVERITIES[status as keyof typeof ROOM_STATUS_SEVERITIES] || 'info'
}
