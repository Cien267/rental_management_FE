import type { ContractStatus, PaymentCycle } from '@/types/contract'

export const CONTRACT_STATUSES: Record<ContractStatus, string> = {
  active: 'Còn hiệu lực',
  ended: 'Đã kết thúc',
  cancelled: 'Đã hủy',
}

export const CONTRACT_PAYMENT_CYCLES: Record<PaymentCycle, string> = {
  monthly: 'Theo tháng',
  quarterly: 'Theo quý',
  yearly: 'Theo năm',
}

export const CONTRACT_STATUS_SEVERITIES: Record<ContractStatus, 'secondary' | 'success' | 'warn'> =
  {
    active: 'success',
    ended: 'secondary',
    cancelled: 'warn',
  }
