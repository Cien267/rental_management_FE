import axios from 'axios'
import type { AxiosInstance } from 'axios'

const timeout = 30000
const baseUrl = import.meta.env.VITE_BASE_URL
import { useMainStore } from '@/stores/main'
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
    const store = useMainStore()
    const token = store.getToken
    if (token && !config.headers['token']) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default apiClient
