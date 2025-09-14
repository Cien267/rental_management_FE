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

export const getUtilityMeters = async (propertyId?: number): Promise<UtilityMeter[]> => {
  const response = await get(UTILITY_METER_URLS.URL_LIST(propertyId))
  return transformApiUtilityMetersToUtilityMeters(response.data.data)
}

export const getUtilityMeter = async (id: number): Promise<UtilityMeter> => {
  const response = await get(UTILITY_METER_URLS.URL_DETAIL(id))
  return transformApiUtilityMeterToUtilityMeter(response.data.data)
}

export const createUtilityMeter = async (
  utilityMeterData: CreateUtilityMeterInput,
  propertyId?: number,
): Promise<UtilityMeter> => {
  const response = await post(
    UTILITY_METER_URLS.URL_CREATE(propertyId),
    transformCreateUtilityMeterToApi(utilityMeterData),
  )
  return transformApiUtilityMeterToUtilityMeter(response.data.data)
}

export const updateUtilityMeter = async (
  id: number,
  utilityMeterData: UpdateUtilityMeterInput,
): Promise<UtilityMeter> => {
  const response = await patch(
    UTILITY_METER_URLS.URL_UPDATE(id),
    transformUpdateUtilityMeterToApi({ ...utilityMeterData, id }),
  )
  return transformApiUtilityMeterToUtilityMeter(response.data.data)
}

export const deleteUtilityMeter = async (id: number): Promise<void> => {
  await del(UTILITY_METER_URLS.URL_DELETE(id))
}
