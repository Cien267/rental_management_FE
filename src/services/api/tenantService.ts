import { get, post, patch, del } from '@/helpers/axios'
import { TENANT_URLS } from '@/constants/urls'
import {
  transformApiTenantsToTenants,
  transformApiTenantToTenant,
  transformCreateTenantToApi,
  transformUpdateTenantToApi,
} from '@/transformers/tenants'
import type { Tenant, CreateTenantInput, UpdateTenantInput } from '@/types/tenant'

export const getTenants = async (propertyId?: number): Promise<Tenant[]> => {
  const response = await get(TENANT_URLS.URL_LIST(propertyId))
  return transformApiTenantsToTenants(response.data.data)
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
  return transformApiTenantToTenant(response.data.data)
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
  return transformApiTenantToTenant(response.data.data)
}

export const deleteTenant = async (id: number, propertyId?: number): Promise<void> => {
  await del(TENANT_URLS.URL_DELETE(id, propertyId))
}
