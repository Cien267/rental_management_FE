import type { PaymentMethod } from '@/types/payment'

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: 'Cash',
  bank_transfer: 'Bank transfer',
  online: 'Online',
}
