import axios from 'axios'
import type { AxiosInstance } from 'axios'

const timeout = 30000
const baseUrl = import.meta.env.VITE_BASE_URL
import { useAuth } from '@/composables/auth/useAuth'
/**
 * Creates an Axios instance with preconfigured settings for API requests.
 * @type {AxiosInstance}
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: timeout,
})

apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuth()
    if (token && token.value && !config.headers['token']) {
      config.headers['Authorization'] = `Bearer ${token.value}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default apiClient
