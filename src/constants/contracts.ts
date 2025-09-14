import type { ContractStatus, PaymentCycle } from '@/types/contract'

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  active: 'Active',
  ended: 'Ended',
  cancelled: 'Cancelled',
}

export const PAYMENT_CYCLE_LABEL: Record<PaymentCycle, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
}
