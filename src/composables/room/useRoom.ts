import { ref, computed } from 'vue'
import { useCustomToast } from '@/composables/base/useCustomToast'
import * as roomService from '@/services/api/roomService'
import type { Room, CreateRoomInput, UpdateRoomInput } from '@/types/room'

export const useRoom = () => {
  const { tSuccess, tError } = useCustomToast()

  const rooms = ref<Room[]>([])
  const currentRoom = ref<Room | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isEmpty = computed(() => !loading.value && rooms.value.length === 0)

  const fetchRooms = async (propertyId?: number) => {
    loading.value = true
    error.value = null
    try {
      rooms.value = await roomService.getRooms(propertyId)
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to fetch rooms'
      error.value = eMsg
      tError('Error', eMsg)
    } finally {
      loading.value = false
    }
  }

  const fetchRoom = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentRoom.value = await roomService.getRoom(id)
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to fetch room'
      error.value = eMsg
      tError('Error', eMsg)
    } finally {
      loading.value = false
    }
  }

  const createRoom = async (roomData: CreateRoomInput, propertyId?: number) => {
    loading.value = true
    error.value = null
    try {
      const newRoom = await roomService.createRoom(roomData, propertyId)
      rooms.value.push(newRoom)
      tSuccess('Success', 'Room created successfully')
      return newRoom
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to create room'
      error.value = eMsg
      tError('Error', eMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRoom = async (id: number, roomData: UpdateRoomInput) => {
    loading.value = true
    error.value = null
    try {
      const updatedRoom = await roomService.updateRoom(id, roomData)
      const index = rooms.value.findIndex((room) => room.id === id)
      if (index !== -1) {
        rooms.value[index] = updatedRoom
      }
      if (currentRoom.value?.id === id) {
        currentRoom.value = updatedRoom
      }
      tSuccess('Success', 'Room updated successfully')
      return updatedRoom
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to update room'
      error.value = eMsg
      tError('Error', eMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRoom = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await roomService.deleteRoom(id)
      rooms.value = rooms.value.filter((room) => room.id !== id)
      if (currentRoom.value?.id === id) {
        currentRoom.value = null
      }
      tSuccess('Success', 'Room deleted successfully')
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to delete room'
      error.value = eMsg
      tError('Error', eMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    rooms: computed(() => rooms.value),
    currentRoom: computed(() => currentRoom.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isEmpty,
    fetchRooms,
    fetchRoom,
    createRoom,
    updateRoom,
    deleteRoom,
  }
}
