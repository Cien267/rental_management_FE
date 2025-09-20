import type { Gender } from '@/types/tenant'

export const TENANT_GENDERS: Record<Gender, string> = {
  male: 'nam',
  female: 'nữ',
  other: 'giới tính khác',
}

export const TENANT_GENDER_SEVERITIES: Record<Gender, 'info' | 'success' | 'warn'> = {
  male: 'info',
  female: 'success',
  other: 'warn',
}
