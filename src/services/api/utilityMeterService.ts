import { get, post, patch, del } from '@/helpers/axios'
import { UTILITY_METER_URLS } from '@/constants/urls'
import {
  transformApiUtilityMetersToUtilityMeters,
  transformApiUtilityMeterToUtilityMeter,
  transformCreateUtilityMeterToApi,
  transformUpdateUtilityMeterToApi,
} from '@/transformers/utilityMeters'
import type {
  UtilityMeter,
  CreateUtilityMeterInput,
  UpdateUtilityMeterInput,
} from '@/types/utilityMeter'

export const getUtilityMeters = async (
  propertyId?: number,
  params?: {
    fullName?: string
    phone?: string
    email?: string
    roomId?: number
    gender?: string
    limit?: number
    page?: number
    sortBy?: string
  },
): Promise<{
  results: UtilityMeter[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
}> => {
  const response = await get(UTILITY_METER_URLS.URL_LIST(propertyId), { params })
  return {
    results: transformApiUtilityMetersToUtilityMeters(response.data.results),
    page: response.data.page,
    limit: response.data.limit,
    totalPages: response.data.totalPages,
    totalResults: response.data.totalResults,
  }
}

export const getUtilityMeter = async (id: number, propertyId?: number): Promise<UtilityMeter> => {
  const response = await get(UTILITY_METER_URLS.URL_DETAIL(id, propertyId))
  return transformApiUtilityMeterToUtilityMeter(response.data)
}

export const createUtilityMeter = async (
  utilityMeterData: CreateUtilityMeterInput,
  propertyId?: number,
): Promise<void> => {
  await post(
    UTILITY_METER_URLS.URL_CREATE(propertyId),
    transformCreateUtilityMeterToApi(utilityMeterData),
  )
}

export const updateUtilityMeter = async (
  id: number,
  utilityMeterData: UpdateUtilityMeterInput,
  propertyId?: number,
): Promise<UtilityMeter> => {
  const response = await patch(
    UTILITY_METER_URLS.URL_UPDATE(id, propertyId),
    transformUpdateUtilityMeterToApi({ ...utilityMeterData, id }),
  )
  return transformApiUtilityMeterToUtilityMeter(response.data)
}

export const deleteUtilityMeter = async (id: number, propertyId?: number): Promise<void> => {
  await del(UTILITY_METER_URLS.URL_DELETE(id, propertyId))
}
