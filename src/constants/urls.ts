// AUTHENTICATION
export const AUTH_URLS = {
  URL_LOGIN: '/v1/auth/login',
  URL_LOGOUT: '/v1/auth/logout',
}

// USERS
export const USER_URLS = {
  URL_LIST: '/v1/users',
  URL_DETAIL: (id: number | string) => `/v1/users/${id}`,
  URL_CREATE: '/v1/users',
  URL_UPDATE: (id: number | string) => `/v1/users/${id}`,
  URL_DELETE: (id: number | string) => `/v1/users/${id}`,
}

// PROPERTIES
export const PROPERTY_URLS = {
  URL_LIST: '/v1/properties',
  URL_DETAIL: (id: number | string) => `/v1/properties/${id}`,
  URL_CREATE: '/v1/properties',
  URL_UPDATE: (id: number | string) => `/v1/properties/${id}`,
  URL_DELETE: (id: number | string) => `/v1/properties/${id}`,
  URL_DASHBOARD: (id: number | string) => `/v1/properties/${id}/dashboard`,
}

// EXTRA FEES
export const EXTRA_FEE_URLS = {
  URL_LIST: (propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/extra-fees` : '/v1/extra-fees',
  URL_DETAIL: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/extra-fees/${id}` : `/v1/extra-fees/${id}`,
  URL_CREATE: (propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/extra-fees` : '/v1/extra-fees',
  URL_UPDATE: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/extra-fees/${id}` : `/v1/extra-fees/${id}`,
  URL_DELETE: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/extra-fees/${id}` : `/v1/extra-fees/${id}`,
}

// ROOMS
export const ROOM_URLS = {
  URL_LIST: (propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/rooms` : '/v1/rooms',
  URL_DETAIL: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/rooms/${id}` : `/v1/rooms/${id}`,
  URL_CREATE: (propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/rooms` : '/v1/rooms',
  URL_UPDATE: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/rooms/${id}` : `/v1/rooms/${id}`,
  URL_DELETE: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/rooms/${id}` : `/v1/rooms/${id}`,
}

// TENANTS
export const TENANT_URLS = {
  URL_LIST: (propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/tenants` : '/v1/tenants',
  URL_DETAIL: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/tenants/${id}` : `/v1/tenants/${id}`,
  URL_CREATE: (propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/tenants` : '/v1/tenants',
  URL_UPDATE: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/tenants/${id}` : `/v1/tenants/${id}`,
  URL_DELETE: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/tenants/${id}` : `/v1/tenants/${id}`,
}

// CONTRACTS
export const CONTRACT_URLS = {
  URL_LIST: (propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/contracts` : '/v1/contracts',
  URL_DETAIL: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/contracts/${id}` : `/v1/contracts/${id}`,
  URL_CREATE: (propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/contracts` : '/v1/contracts',
  URL_UPDATE: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/contracts/${id}` : `/v1/contracts/${id}`,
  URL_DELETE: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/contracts/${id}` : `/v1/contracts/${id}`,
}

// UTILITY METERS
export const UTILITY_METER_URLS = {
  URL_LIST: (propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/utility-meters` : '/v1/utility-meters',
  URL_DETAIL: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/utility-meters/${id}` : `/v1/utility-meters/${id}`,
  URL_CREATE: (propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/utility-meters` : '/v1/utility-meters',
  URL_UPDATE: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/utility-meters/${id}` : `/v1/utility-meters/${id}`,
  URL_DELETE: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/utility-meters/${id}` : `/v1/utility-meters/${id}`,
}

// UTILITY METER READINGS
export const UTILITY_METER_READING_URLS = {
  URL_LIST: (utilityMeterId?: number | string, propertyId?: number | string) =>
    utilityMeterId && propertyId
      ? `/v1/properties/${propertyId}/utility-meters/${utilityMeterId}/readings`
      : utilityMeterId
        ? `/v1/utility-meters/${utilityMeterId}/readings`
        : '/v1/utility-meter-readings',
  URL_DETAIL: (
    id: number | string,
    utilityMeterId?: number | string,
    propertyId?: number | string,
  ) =>
    utilityMeterId && propertyId
      ? `/v1/properties/${propertyId}/utility-meters/${utilityMeterId}/readings/${id}`
      : `/v1/utility-meter-readings/${id}`,
  URL_CREATE: (utilityMeterId?: number | string, propertyId?: number | string) =>
    utilityMeterId && propertyId
      ? `/v1/properties/${propertyId}/utility-meters/${utilityMeterId}/readings`
      : utilityMeterId
        ? `/v1/utility-meters/${utilityMeterId}/readings`
        : '/v1/utility-meter-readings',
  URL_UPDATE: (
    id: number | string,
    utilityMeterId?: number | string,
    propertyId?: number | string,
  ) =>
    utilityMeterId && propertyId
      ? `/v1/properties/${propertyId}/utility-meters/${utilityMeterId}/readings/${id}`
      : `/v1/utility-meter-readings/${id}`,
  URL_DELETE: (
    id: number | string,
    utilityMeterId?: number | string,
    propertyId?: number | string,
  ) =>
    utilityMeterId && propertyId
      ? `/v1/properties/${propertyId}/utility-meters/${utilityMeterId}/readings/${id}`
      : `/v1/utility-meter-readings/${id}`,
}

// INVOICES
export const INVOICE_URLS = {
  URL_LIST: (propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/invoices` : '/v1/invoices',
  URL_DETAIL: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/invoices/${id}` : `/v1/invoices/${id}`,
  URL_CREATE: (propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/invoices` : '/v1/invoices',
  URL_UPDATE: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/invoices/${id}` : `/v1/invoices/${id}`,
  URL_DELETE: (id: number | string, propertyId?: number | string) =>
    propertyId ? `/v1/properties/${propertyId}/invoices/${id}` : `/v1/invoices/${id}`,
}

// PAYMENTS
export const PAYMENT_URLS = {
  URL_LIST: (invoiceId?: number | string, propertyId?: number | string) =>
    invoiceId && propertyId
      ? `/v1/properties/${propertyId}/invoices/${invoiceId}/payments`
      : invoiceId
        ? `/v1/invoices/${invoiceId}/payments`
        : '/v1/payments',
  URL_DETAIL: (id: number | string, invoiceId?: number | string, propertyId?: number | string) =>
    invoiceId && propertyId
      ? `/v1/properties/${propertyId}/invoices/${invoiceId}/payments/${id}`
      : `/v1/payments/${id}`,
  URL_CREATE: (invoiceId?: number | string, propertyId?: number | string) =>
    invoiceId && propertyId
      ? `/v1/properties/${propertyId}/invoices/${invoiceId}/payments`
      : invoiceId
        ? `/v1/invoices/${invoiceId}/payments`
        : '/v1/payments',
  URL_UPDATE: (id: number | string, invoiceId?: number | string, propertyId?: number | string) =>
    invoiceId && propertyId
      ? `/v1/properties/${propertyId}/invoices/${invoiceId}/payments/${id}`
      : `/v1/payments/${id}`,
  URL_DELETE: (id: number | string, invoiceId?: number | string, propertyId?: number | string) =>
    invoiceId && propertyId
      ? `/v1/properties/${propertyId}/invoices/${invoiceId}/payments/${id}`
      : `/v1/payments/${id}`,
}
