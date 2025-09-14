import { get, post, patch, del } from '@/helpers/axios'
import { TENANT_URLS } from '@/constants/urls'
import {
  transformApiTenantsToTenants,
  transformApiTenantToTenant,
  transformCreateTenantToApi,
  transformUpdateTenantToApi,
} from '@/transformers/tenants'
import type { Tenant, CreateTenantInput, UpdateTenantInput } from '@/types/tenant'

export const getTenants = async (): Promise<Tenant[]> => {
  const response = await get(TENANT_URLS.URL_LIST)
  return transformApiTenantsToTenants(response.data.data)
}

export const getTenant = async (id: number): Promise<Tenant> => {
  const response = await get(TENANT_URLS.URL_DETAIL(id))
  return transformApiTenantToTenant(response.data.data)
}

export const createTenant = async (tenantData: CreateTenantInput): Promise<Tenant> => {
  const response = await post(TENANT_URLS.URL_CREATE, transformCreateTenantToApi(tenantData))
  return transformApiTenantToTenant(response.data.data)
}

export const updateTenant = async (id: number, tenantData: UpdateTenantInput): Promise<Tenant> => {
  const response = await patch(
    TENANT_URLS.URL_UPDATE(id),
    transformUpdateTenantToApi({ ...tenantData, id }),
  )
  return transformApiTenantToTenant(response.data.data)
}

export const deleteTenant = async (id: number): Promise<void> => {
  await del(TENANT_URLS.URL_DELETE(id))
}
