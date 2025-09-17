import { get, post, patch, del } from '@/helpers/axios'
import { CONTRACT_URLS } from '@/constants/urls'
import {
  transformApiContractsToContracts,
  transformApiContractToContract,
  transformCreateContractToApi,
  transformUpdateContractToApi,
} from '@/transformers/contracts'
import type { Contract, CreateContractInput, UpdateContractInput } from '@/types/contract'

export const getContracts = async (propertyId?: number): Promise<Contract[]> => {
  const response = await get(CONTRACT_URLS.URL_LIST(propertyId))
  return transformApiContractsToContracts(response.data.data)
}

export const getContract = async (id: number, propertyId?: number): Promise<Contract> => {
  const response = await get(CONTRACT_URLS.URL_DETAIL(id, propertyId))
  return transformApiContractToContract(response.data.data)
}

export const createContract = async (
  contractData: CreateContractInput,
  propertyId?: number,
): Promise<Contract> => {
  const response = await post(
    CONTRACT_URLS.URL_CREATE(propertyId),
    transformCreateContractToApi(contractData),
  )
  return transformApiContractToContract(response.data.data)
}

export const updateContract = async (
  id: number,
  contractData: UpdateContractInput,
  propertyId?: number,
): Promise<Contract> => {
  const response = await patch(
    CONTRACT_URLS.URL_UPDATE(id, propertyId),
    transformUpdateContractToApi({ ...contractData, id }),
  )
  return transformApiContractToContract(response.data.data)
}

export const deleteContract = async (id: number, propertyId?: number): Promise<void> => {
  await del(CONTRACT_URLS.URL_DELETE(id, propertyId))
}
