import { z } from 'zod'
import {
  ContractRecordSchema,
  type Contract,
  type CreateContractInput,
  type UpdateContractInput,
} from '@/types/contract'
import { CONTRACT_STATUSES, CONTRACT_STATUS_SEVERITIES } from '@/constants/contracts'

const ApiContractSchema = z.object({
  id: z.number(),
  roomId: z.number(),
  tenantId: z.number(),
  room: z.any().optional(),
  tenant: z.any().optional(),
  startDate: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  endDate: z
    .union([z.string(), z.date()])
    .transform((v) => (v ? new Date(v as any) : null))
    .nullable()
    .optional(),
  depositAmount: z
    .union([z.number(), z.string()])
    .transform((v) => Number(v))
    .default(0),
  status: z.enum(['active', 'ended', 'cancelled']).default('active'),
  createdAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  updatedAt: z.union([z.string(), z.date()]).transform((v) => new Date(v as any)),
  paymentCycle: z.enum(['monthly', 'quarterly', 'yearly']).default('monthly'),
})

export type ApiContract = z.infer<typeof ApiContractSchema>

export function transformApiContractToContract(record: unknown): Contract {
  const parsed = ApiContractSchema.parse(record)
  return ContractRecordSchema.parse(parsed)
}

export function transformApiContractsToContracts(records: unknown[]): Contract[] {
  return records.map(transformApiContractToContract)
}

export function transformCreateContractToApi(payload: CreateContractInput) {
  return {
    roomId: payload.roomId,
    tenantId: payload.tenantId,
    startDate: payload.startDate,
    endDate: payload.endDate ?? null,
    depositAmount: payload.depositAmount ?? 0,
    status: payload.status ?? 'active',
    paymentCycle: payload.paymentCycle ?? 'monthly',
  }
}

export function transformUpdateContractToApi(payload: UpdateContractInput) {
  return {
    roomId: payload.roomId,
    tenantId: payload.tenantId,
    startDate: payload.startDate,
    endDate: payload.endDate,
    depositAmount: payload.depositAmount,
    status: payload.status,
    paymentCycle: payload.paymentCycle,
  }
}

export const getContractStatusValue = (status: string) => {
  return CONTRACT_STATUSES[status as keyof typeof CONTRACT_STATUSES] || '---'
}

export const getContractStatusSeverity = (status: string) => {
  return CONTRACT_STATUS_SEVERITIES[status as keyof typeof CONTRACT_STATUS_SEVERITIES] || 'info'
}
