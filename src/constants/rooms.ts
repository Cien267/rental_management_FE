import type { RoomStatus } from '@/types/room'

export const ROOM_STATUSES: Record<RoomStatus, string> = {
  available: 'Còn trống',
  occupied: 'Đã thuê',
  maintenance: 'Bảo trì',
}

export const ROOM_STATUS_SEVERITIES: Record<RoomStatus, 'info' | 'success' | 'warn'> = {
  available: 'info',
  occupied: 'success',
  maintenance: 'warn',
}
