import { ref } from 'vue'
import { login } from '@/services/api/authService'
import type { DataLoginType } from '@/types/auth'
import Cookies from 'js-cookie'

const COOKIES_TOKEN_NAME = 'rental-management-user-token'
const token = ref(Cookies.get(COOKIES_TOKEN_NAME) || null)
const user = ref(null)

const handleLogin = async (credentials: DataLoginType) => {
  try {
    const response = await login(credentials)
    const tokenUser = response?.tokens?.access?.token
    const expires = response?.tokens?.access?.expires
    token.value = tokenUser
    Cookies.set(COOKIES_TOKEN_NAME, tokenUser, { expires: new Date(expires) ?? 1 })
    return true
  } catch (error) {
    console.error('Login failed', error)
  }
}

const handleLogout = () => {
  token.value = null
  user.value = null
  Cookies.remove(COOKIES_TOKEN_NAME)
}

export const useAuth = () => {
  return {
    token,
    user,
    handleLogin,
    handleLogout,
  }
}
