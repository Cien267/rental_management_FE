import type { InvoiceStatus } from '@/types/invoice'

export const INVOICE_STATUSES: Record<InvoiceStatus, string> = {
  unpaid: 'Chưa thanh toán',
  partially_paid: 'Thanh toán một phần',
  paid: 'Đã thanh toán',
  overdue: 'Quá hạn',
}

export const INVOICE_STATUS_SEVERITIES: Record<
  InvoiceStatus,
  'secondary' | 'info' | 'success' | 'warn'
> = {
  unpaid: 'secondary',
  partially_paid: 'info',
  paid: 'success',
  overdue: 'warn',
}
