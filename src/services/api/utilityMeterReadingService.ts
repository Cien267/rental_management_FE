import { get, post, patch, del } from '@/helpers/axios'
import { UTILITY_METER_READING_URLS } from '@/constants/urls'
import {
  transformApiUtilityMeterReadingsToUtilityMeterReadings,
  transformApiUtilityMeterReadingToUtilityMeterReading,
  transformCreateUtilityMeterReadingToApi,
  transformUpdateUtilityMeterReadingToApi,
} from '@/transformers/utilityMeterReadings'
import type {
  UtilityMeterReading,
  CreateUtilityMeterReadingInput,
  UpdateUtilityMeterReadingInput,
} from '@/types/utilityMeterReading'

export const getUtilityMeterReadings = async (
  utilityMeterId?: number,
  propertyId?: number,
  params?: {
    limit?: number
    page?: number
    sortBy?: string
  },
): Promise<{
  results: UtilityMeterReading[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
}> => {
  const response = await get(UTILITY_METER_READING_URLS.URL_LIST(utilityMeterId, propertyId), {
    params,
  })
  return {
    results: transformApiUtilityMeterReadingsToUtilityMeterReadings(response.data.data),
    page: response.data.page,
    limit: response.data.limit,
    totalPages: response.data.totalPages,
    totalResults: response.data.totalResults,
  }
}

export const getUtilityMeterReading = async (
  id: number,
  utilityMeterId?: number,
  propertyId?: number,
): Promise<UtilityMeterReading> => {
  const response = await get(UTILITY_METER_READING_URLS.URL_DETAIL(id, utilityMeterId, propertyId))
  return transformApiUtilityMeterReadingToUtilityMeterReading(response.data)
}

export const createUtilityMeterReading = async (
  readingData: CreateUtilityMeterReadingInput,
  utilityMeterId?: number,
  propertyId?: number,
): Promise<UtilityMeterReading> => {
  const response = await post(
    UTILITY_METER_READING_URLS.URL_CREATE(utilityMeterId, propertyId),
    transformCreateUtilityMeterReadingToApi(readingData),
  )
  return transformApiUtilityMeterReadingToUtilityMeterReading(response.data)
}

export const updateUtilityMeterReading = async (
  id: number,
  readingData: UpdateUtilityMeterReadingInput,
  utilityMeterId?: number,
  propertyId?: number,
): Promise<UtilityMeterReading> => {
  const response = await patch(
    UTILITY_METER_READING_URLS.URL_UPDATE(id, utilityMeterId, propertyId),
    transformUpdateUtilityMeterReadingToApi({ ...readingData, id }),
  )
  return transformApiUtilityMeterReadingToUtilityMeterReading(response.data)
}

export const deleteUtilityMeterReading = async (
  id: number,
  utilityMeterId?: number,
  propertyId?: number,
): Promise<void> => {
  await del(UTILITY_METER_READING_URLS.URL_DELETE(id, utilityMeterId, propertyId))
}
