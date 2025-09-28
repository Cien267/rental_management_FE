import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
dayjs.locale('vi')

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return function (this: any, ...args: Parameters<F>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}

export const normalizeText = (item: string) => {
  return item
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const formatSearch = (value: string) => {
  return normalizeText((value ?? '').toLowerCase().trim())
}

export const preventInputNotNumber = (event: any) => {
  const charCode = event.charCode || event.keyCode
  const char = String.fromCharCode(charCode)

  if (!/[0-9]/.test(char)) {
    event.preventDefault()
  }
}

export const formatDate = (
  value: Date | string | number | null | undefined,
  format = 'DD/MM/YYYY HH:mm',
) => {
  if (!value) return '---'
  try {
    const d = dayjs(value)
    if (!d.isValid()) return '---'
    return d.format(format)
  } catch (error: any) {
    console.error('Date format error utils:', error)
    return '---'
  }
}

export const formatCurrency = (
  value: number | string | null | undefined,
  locale: string = 'vi-VN',
  currency: string = 'VND',
): string => {
  if (value == null || value === '') return '-'
  const number = typeof value === 'string' ? Number(value) : value
  if (isNaN(number)) return '-'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

export const formatNumber = (num: string | number, locale: string = 'vi-VN') => {
  if (num === null || num === undefined || num === '') return '-'
  const number = typeof num === 'string' ? Number(num) : num
  if (isNaN(number)) return '-'
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}
