import { z } from 'zod'

export const DataLoginSchema = z.object({
  username: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})

export type DataLoginType = z.infer<typeof DataLoginSchema>
