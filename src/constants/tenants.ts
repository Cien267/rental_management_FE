import type { Gender } from '@/types/tenant'

export const GENDER_LABEL: Record<Exclude<Gender, null | undefined>, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
}
