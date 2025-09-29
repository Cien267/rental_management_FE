import type { MeterType } from '@/types/utilityMeter'

export const UTILITY_METER_TYPES: Record<MeterType, string> = {
  electricity: 'Điện',
  water: 'Nước',
}

export const UTILITY_METER_TYPE_SEVERITIES: Record<MeterType, 'info' | 'secondary'> = {
  electricity: 'secondary',
  water: 'info',
}
