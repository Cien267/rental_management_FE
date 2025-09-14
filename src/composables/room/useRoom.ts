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
    } catch (err) {
      error.value = 'Failed to fetch rooms'
      tError('Error', 'Failed to fetch rooms')
    } finally {
      loading.value = false
    }
  }

  const fetchRoom = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentRoom.value = await roomService.getRoom(id)
    } catch (err) {
      error.value = 'Failed to fetch room'
      tError('Error', 'Failed to fetch room')
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
    } catch (err) {
      error.value = 'Failed to create room'
      tError('Error', 'Failed to create room')
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
    } catch (err) {
      error.value = 'Failed to update room'
      tError('Error', 'Failed to update room')
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
    } catch (err) {
      error.value = 'Failed to delete room'
      tError('Error', 'Failed to delete room')
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
