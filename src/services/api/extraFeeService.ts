import { get, post, patch, del } from '@/helpers/axios'
import { EXTRA_FEE_URLS } from '@/constants/urls'
import {
  transformApiExtraFeesToExtraFees,
  transformApiExtraFeeToExtraFee,
  transformCreateExtraFeeToApi,
  transformUpdateExtraFeeToApi,
} from '@/transformers/extraFees'
import type { ExtraFee, CreateExtraFeeInput, UpdateExtraFeeInput } from '@/types/extraFee'

export const getExtraFees = async (propertyId?: number): Promise<ExtraFee[]> => {
  const response = await get(EXTRA_FEE_URLS.URL_LIST(propertyId))
  return transformApiExtraFeesToExtraFees(response.data.data)
}

export const getExtraFee = async (id: number, propertyId?: number): Promise<ExtraFee> => {
  const response = await get(EXTRA_FEE_URLS.URL_DETAIL(id, propertyId))
  return transformApiExtraFeeToExtraFee(response.data.data)
}

export const createExtraFee = async (
  extraFeeData: CreateExtraFeeInput,
  propertyId?: number,
): Promise<ExtraFee> => {
  const response = await post(
    EXTRA_FEE_URLS.URL_CREATE(propertyId),
    transformCreateExtraFeeToApi(extraFeeData),
  )
  return transformApiExtraFeeToExtraFee(response.data.data)
}

export const updateExtraFee = async (
  id: number,
  extraFeeData: UpdateExtraFeeInput,
  propertyId?: number,
): Promise<ExtraFee> => {
  const response = await patch(
    EXTRA_FEE_URLS.URL_UPDATE(id, propertyId),
    transformUpdateExtraFeeToApi({ ...extraFeeData, id }),
  )
  return transformApiExtraFeeToExtraFee(response.data.data)
}

export const deleteExtraFee = async (id: number, propertyId?: number): Promise<void> => {
  await del(EXTRA_FEE_URLS.URL_DELETE(id, propertyId))
}
