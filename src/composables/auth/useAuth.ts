import { ref } from 'vue'
import { login } from '@/services/api/authService'
import type { DataLoginType } from '@/types/auth'
import Cookies from 'js-cookie'
import type { User } from '@/types/user'

const COOKIES_TOKEN_NAME = 'rental-management-user-token'
const LOCALSTORAGE_USER = 'rental-management-user'
const token = ref(Cookies.get(COOKIES_TOKEN_NAME) || null)
const user = ref(JSON.parse(localStorage.getItem(LOCALSTORAGE_USER) || '{}') || null)

const handleLogin = async (credentials: DataLoginType) => {
  try {
    const response = await login(credentials)
    const tokenUser = response?.tokens?.access?.token
    const expires = response?.tokens?.access?.expires
    token.value = tokenUser
    user.value = response?.user
    Cookies.set(COOKIES_TOKEN_NAME, tokenUser, { expires: expires ? new Date(expires) : 1 })
    localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(response?.user))
    return true
  } catch (error) {
    console.error('Login failed', error)
  }
}

const updateUser = (newUser: User) => {
  user.value = newUser
  localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(newUser))
}

const handleLogout = () => {
  token.value = null
  user.value = null
  Cookies.remove(COOKIES_TOKEN_NAME)
  localStorage.removeItem(LOCALSTORAGE_USER)
}

export const useAuth = () => {
  return {
    token,
    user,
    handleLogin,
    handleLogout,
    updateUser,
  }
}
