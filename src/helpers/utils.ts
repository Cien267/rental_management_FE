import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
