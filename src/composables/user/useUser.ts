import { ref, computed } from 'vue'
import { useCustomToast } from '@/composables/base/useCustomToast'
import * as userService from '@/services/api/userService'
import type { User, CreateUserInput, UpdateUserInput } from '@/types/user'

export const useUser = () => {
  const { tSuccess, tError } = useCustomToast()

  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isEmpty = computed(() => !loading.value && users.value.length === 0)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      users.value = await userService.getUsers()
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to fetch users'
      error.value = eMsg
      tError('Error', eMsg)
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentUser.value = await userService.getUser(id)
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to fetch user'
      error.value = eMsg
      tError('Error', eMsg)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: CreateUserInput) => {
    loading.value = true
    error.value = null
    try {
      const newUser = await userService.createUser(userData)
      users.value.push(newUser)
      tSuccess('Success', 'User created successfully')
      return newUser
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to create user'
      error.value = eMsg
      tError('Error', eMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, userData: UpdateUserInput) => {
    loading.value = true
    error.value = null
    try {
      const updatedUser = await userService.updateUser(id, userData)
      const index = users.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      if (currentUser.value?.id === id) {
        currentUser.value = updatedUser
      }
      tSuccess('Success', 'User updated successfully')
      return updatedUser
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to update user'
      error.value = eMsg
      tError('Error', eMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await userService.deleteUser(id)
      users.value = users.value.filter((user) => user.id !== id)
      if (currentUser.value?.id === id) {
        currentUser.value = null
      }
      tSuccess('Success', 'User deleted successfully')
    } catch (err: any) {
      const eMsg = err?.response?.data?.message ?? 'Failed to delete user'
      error.value = eMsg
      tError('Error', eMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users: computed(() => users.value),
    currentUser: computed(() => currentUser.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isEmpty,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
  }
}
