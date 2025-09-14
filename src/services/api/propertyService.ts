import { get, post, patch, del } from '@/helpers/axios'
import { PROPERTY_URLS } from '@/constants/urls'
import {
  transformApiPropertiesToProperties,
  transformApiPropertyToProperty,
  transformCreatePropertyToApi,
  transformUpdatePropertyToApi,
} from '@/transformers/properties'
import type { Property, CreatePropertyInput, UpdatePropertyInput } from '@/types/property'

export const getProperties = async (): Promise<Property[]> => {
  const response = await get(PROPERTY_URLS.URL_LIST)
  return transformApiPropertiesToProperties(response.data.results)
}

export const getProperty = async (id: number): Promise<Property> => {
  const response = await get(PROPERTY_URLS.URL_DETAIL(id))
  return transformApiPropertyToProperty(response.data)
}

export const createProperty = async (propertyData: CreatePropertyInput): Promise<Property> => {
  const response = await post(PROPERTY_URLS.URL_CREATE, transformCreatePropertyToApi(propertyData))
  return transformApiPropertyToProperty(response.data)
}

export const updateProperty = async (
  id: number,
  propertyData: UpdatePropertyInput,
): Promise<Property> => {
  const response = await patch(
    PROPERTY_URLS.URL_UPDATE(id),
    transformUpdatePropertyToApi({ ...propertyData, id }),
  )
  return transformApiPropertyToProperty(response.data)
}

export const deleteProperty = async (id: number): Promise<void> => {
  await del(PROPERTY_URLS.URL_DELETE(id))
}
