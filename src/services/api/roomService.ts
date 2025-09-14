import { get, post, patch, del } from '@/helpers/axios'
import { ROOM_URLS } from '@/constants/urls'
import {
  transformApiRoomsToRooms,
  transformApiRoomToRoom,
  transformCreateRoomToApi,
  transformUpdateRoomToApi,
} from '@/transformers/rooms'
import type { Room, CreateRoomInput, UpdateRoomInput } from '@/types/room'

export const getRooms = async (propertyId?: number): Promise<Room[]> => {
  const response = await get(ROOM_URLS.URL_LIST(propertyId))
  return transformApiRoomsToRooms(response.data.data)
}

export const getRoom = async (id: number): Promise<Room> => {
  const response = await get(ROOM_URLS.URL_DETAIL(id))
  return transformApiRoomToRoom(response.data.data)
}

export const createRoom = async (roomData: CreateRoomInput, propertyId?: number): Promise<Room> => {
  const response = await post(ROOM_URLS.URL_CREATE(propertyId), transformCreateRoomToApi(roomData))
  return transformApiRoomToRoom(response.data.data)
}

export const updateRoom = async (id: number, roomData: UpdateRoomInput): Promise<Room> => {
  const response = await patch(
    ROOM_URLS.URL_UPDATE(id),
    transformUpdateRoomToApi({ ...roomData, id }),
  )
  return transformApiRoomToRoom(response.data.data)
}

export const deleteRoom = async (id: number): Promise<void> => {
  await del(ROOM_URLS.URL_DELETE(id))
}
