import { post } from '@/helpers/axios'
import { AI_URLS } from '@/constants/urls'

export const extractNumber = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await post(AI_URLS.EXTRACT_NUMBER, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
