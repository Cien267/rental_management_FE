import { post } from '@/helpers/axios'
import type { DataLoginType } from '@/types/auth'
import { AUTH_URLS } from '@/constants/urls'

export const login = async (dataLogin: DataLoginType) => {
  const response = await post(AUTH_URLS.URL_LOGIN, dataLogin)
  return response?.data
}

export const logout = async () => {
  const response = await post(AUTH_URLS.URL_LOGOUT, {})
  return response?.data
}
