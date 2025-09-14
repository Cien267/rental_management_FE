import type { ChargeType } from '@/types/extraFee'

export const CHARGE_TYPES = {
  MONTHLY: 'monthly',
  ONE_TIME: 'one_time',
} as const satisfies Record<string, ChargeType>

export const CHARGE_TYPE_LABEL: Record<ChargeType, string> = {
  monthly: 'Monthly',
  one_time: 'One-time',
}
