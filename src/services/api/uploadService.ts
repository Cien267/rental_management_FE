import { post, del } from '@/helpers/axios'

export interface UploadResponse {
  status: string
  message: string
  data: {
    filename: string
    originalName: string
    path: string
    size: number
    mimetype: string
  }
}

export interface MultipleUploadResponse {
  status: string
  message: string
  data: Array<{
    filename: string
    originalName: string
    path: string
    size: number
    mimetype: string
  }>
}

/**
 * Upload single image
 */
export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('image', file)

  const response = await post('/v1/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

/**
 * Upload multiple images (max 10)
 */
export async function uploadImages(files: File[]): Promise<MultipleUploadResponse> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('images', file)
  })

  const response = await post('/v1/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

/**
 * Delete image by filename
 */
export async function deleteImage(filename: string): Promise<{ status: string; message: string }> {
  const response = await del(`/v1/upload/image/${filename}`)
  return response.data
}

/**
 * Get full image URL from path
 */
export function getImageUrl(path: string): string {
  if (!path) return ''

  // If it's already a full URL, return as is
  if (path.startsWith('http')) return path

  // If it's a relative path, prepend the base URL
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}${path}`
}
