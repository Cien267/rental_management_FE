import { get, post, patch, del } from '@/helpers/axios'
import { ROOM_URLS } from '@/constants/urls'
import {
  transformApiRoomsToRooms,
  transformApiRoomToRoom,
  transformCreateRoomToApi,
  transformUpdateRoomToApi,
} from '@/transformers/rooms'
import type { Room, CreateRoomInput, UpdateRoomInput } from '@/types/room'

export const getRooms = async (
  propertyId?: number,
  params?: { limit?: number; page?: number; name?: string; status?: string },
): Promise<{
  results: Room[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
}> => {
  const response = await get(ROOM_URLS.URL_LIST(propertyId), { params })
  return {
    results: transformApiRoomsToRooms(response.data.results),
    page: response.data.page,
    limit: response.data.limit,
    totalPages: response.data.totalPages,
    totalResults: response.data.totalResults,
  }
}

export const getRoom = async (id: number, propertyId?: number): Promise<Room> => {
  const response = await get(ROOM_URLS.URL_DETAIL(id, propertyId))
  return transformApiRoomToRoom(response.data.data)
}

export const createRoom = async (roomData: CreateRoomInput, propertyId?: number): Promise<Room> => {
  const response = await post(ROOM_URLS.URL_CREATE(propertyId), transformCreateRoomToApi(roomData))
  return transformApiRoomToRoom(response.data)
}

export const updateRoom = async (
  id: number,
  roomData: UpdateRoomInput,
  propertyId?: number,
): Promise<Room> => {
  const response = await patch(
    ROOM_URLS.URL_UPDATE(id, propertyId),
    transformUpdateRoomToApi({ ...roomData, id }),
  )
  return transformApiRoomToRoom(response.data)
}

export const deleteRoom = async (id: number, propertyId?: number): Promise<void> => {
  await del(ROOM_URLS.URL_DELETE(id, propertyId))
}
