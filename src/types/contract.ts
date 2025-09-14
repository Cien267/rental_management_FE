import { z } from 'zod'

export const ContractStatusEnum = z.enum(['active', 'ended', 'cancelled'])
export type ContractStatus = z.infer<typeof ContractStatusEnum>

export const PaymentCycleEnum = z.enum(['monthly', 'quarterly', 'yearly'])
export type PaymentCycle = z.infer<typeof PaymentCycleEnum>

export const ContractRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  roomId: z.number().int().nonnegative(),
  tenantId: z.number().int().nonnegative(),
  startDate: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  endDate: z
    .union([z.string(), z.date()])
    .transform((v) => (v ? new Date(v as any) : null))
    .nullable()
    .optional(),
  depositAmount: z.number().default(0),
  status: ContractStatusEnum.default('active'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  paymentCycle: PaymentCycleEnum.default('monthly'),
})

export type Contract = z.infer<typeof ContractRecordSchema>

export const CreateContractSchema = z.object({
  roomId: z.number().int(),
  tenantId: z.number().int(),
  startDate: z.union([z.string(), z.date()]),
  endDate: z.union([z.string(), z.date()]).optional(),
  depositAmount: z.number().nonnegative().optional(),
  status: ContractStatusEnum.optional(),
  paymentCycle: PaymentCycleEnum.optional().default('monthly'),
})

export type CreateContractInput = z.infer<typeof CreateContractSchema>

export const UpdateContractSchema = z.object({
  id: z.number().int(),
  roomId: z.number().int().optional(),
  tenantId: z.number().int().optional(),
  startDate: z.union([z.string(), z.date()]).optional(),
  endDate: z.union([z.string(), z.date()]).optional(),
  depositAmount: z.number().nonnegative().optional(),
  status: ContractStatusEnum.optional(),
  paymentCycle: PaymentCycleEnum.optional(),
})

export type UpdateContractInput = z.infer<typeof UpdateContractSchema>
