import type { PropertyStatus } from '@/types/property'

export const PROPERTY_STATUS: Record<PropertyStatus, number> = {
  inactive: 0,
  active: 1,
  maintenance: 2,
}

export const PROPERTY_STATUS_LABEL: Record<PropertyStatus, string> = {
  inactive: 'Inactive',
  active: 'Active',
  maintenance: 'Maintenance',
}
