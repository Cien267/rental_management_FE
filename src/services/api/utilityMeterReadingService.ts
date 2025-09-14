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
): Promise<UtilityMeterReading[]> => {
  const response = await get(UTILITY_METER_READING_URLS.URL_LIST(utilityMeterId))
  return transformApiUtilityMeterReadingsToUtilityMeterReadings(response.data.data)
}

export const getUtilityMeterReading = async (id: number): Promise<UtilityMeterReading> => {
  const response = await get(UTILITY_METER_READING_URLS.URL_DETAIL(id))
  return transformApiUtilityMeterReadingToUtilityMeterReading(response.data.data)
}

export const createUtilityMeterReading = async (
  readingData: CreateUtilityMeterReadingInput,
  utilityMeterId?: number,
): Promise<UtilityMeterReading> => {
  const response = await post(
    UTILITY_METER_READING_URLS.URL_CREATE(utilityMeterId),
    transformCreateUtilityMeterReadingToApi(readingData),
  )
  return transformApiUtilityMeterReadingToUtilityMeterReading(response.data.data)
}

export const updateUtilityMeterReading = async (
  id: number,
  readingData: UpdateUtilityMeterReadingInput,
): Promise<UtilityMeterReading> => {
  const response = await patch(
    UTILITY_METER_READING_URLS.URL_UPDATE(id),
    transformUpdateUtilityMeterReadingToApi({ ...readingData, id }),
  )
  return transformApiUtilityMeterReadingToUtilityMeterReading(response.data.data)
}

export const deleteUtilityMeterReading = async (id: number): Promise<void> => {
  await del(UTILITY_METER_READING_URLS.URL_DELETE(id))
}
