import { get, post, patch, del } from '@/helpers/axios'
import { TENANT_URLS } from '@/constants/urls'
import {
  transformApiTenantsToTenants,
  transformApiTenantToTenant,
  transformCreateTenantToApi,
  transformUpdateTenantToApi,
} from '@/transformers/tenants'
import type { Tenant, CreateTenantInput, UpdateTenantInput } from '@/types/tenant'

export const getTenants = async (
  propertyId?: number,
  params?: {
    fullName?: string
    phone?: string
    email?: string
    roomId?: number
    gender?: string
    limit?: number
    page?: number
  },
): Promise<{
  results: Tenant[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
}> => {
  const response = await get(TENANT_URLS.URL_LIST(propertyId), { params })
  return {
    results: transformApiTenantsToTenants(response.data.results),
    page: response.data.page,
    limit: response.data.limit,
    totalPages: response.data.totalPages,
    totalResults: response.data.totalResults,
  }
}

export const getTenant = async (id: number, propertyId?: number): Promise<Tenant> => {
  const response = await get(TENANT_URLS.URL_DETAIL(id, propertyId))
  return transformApiTenantToTenant(response.data.data)
}

export const createTenant = async (
  tenantData: CreateTenantInput,
  propertyId?: number,
): Promise<Tenant> => {
  const response = await post(
    TENANT_URLS.URL_CREATE(propertyId),
    transformCreateTenantToApi(tenantData),
  )
  return transformApiTenantToTenant(response.data)
}

export const updateTenant = async (
  id: number,
  tenantData: UpdateTenantInput,
  propertyId?: number,
): Promise<Tenant> => {
  const response = await patch(
    TENANT_URLS.URL_UPDATE(id, propertyId),
    transformUpdateTenantToApi({ ...tenantData, id }),
  )
  return transformApiTenantToTenant(response.data)
}

export const deleteTenant = async (id: number, propertyId?: number): Promise<void> => {
  await del(TENANT_URLS.URL_DELETE(id, propertyId))
}
