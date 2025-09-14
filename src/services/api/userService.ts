import { get, post, patch, del } from '@/helpers/axios'
import { USER_URLS } from '@/constants/urls'
import {
  transformApiUsersToUsers,
  transformApiUserToUser,
  transformCreateUserToApi,
  transformUpdateUserToApi,
} from '@/transformers/users'
import type { User, CreateUserInput, UpdateUserInput } from '@/types/user'
import { useAuth } from '@/composables/auth/useAuth'

export const getUsers = async (): Promise<User[]> => {
  const response = await get(USER_URLS.URL_LIST)
  return transformApiUsersToUsers(response.data)
}

export const getUser = async (id: number): Promise<User> => {
  const response = await get(USER_URLS.URL_DETAIL(id))
  return transformApiUserToUser(response.data)
}

export const createUser = async (userData: CreateUserInput): Promise<User> => {
  const response = await post(USER_URLS.URL_CREATE, transformCreateUserToApi(userData))
  return transformApiUserToUser(response.data)
}

export const updateUser = async (id: number, userData: UpdateUserInput): Promise<User> => {
  const { updateUser } = useAuth()
  const response = await patch(
    USER_URLS.URL_UPDATE(id),
    transformUpdateUserToApi({ ...userData, id }),
  )
  updateUser(response.data)
  return transformApiUserToUser(response.data)
}

export const deleteUser = async (id: number): Promise<void> => {
  await del(USER_URLS.URL_DELETE(id))
}
