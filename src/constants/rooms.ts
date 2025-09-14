import type { RoomStatus } from '@/types/room'

export const ROOM_STATUS_LABEL: Record<RoomStatus, string> = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
}
