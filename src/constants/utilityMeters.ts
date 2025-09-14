import type { MeterType } from '@/types/utilityMeter'

export const METER_TYPES = {
  ELECTRICITY: 'electricity',
  WATER: 'water',
} as const satisfies Record<string, MeterType>

export const METER_TYPE_LABEL: Record<MeterType, string> = {
  electricity: 'Electricity',
  water: 'Water',
}
