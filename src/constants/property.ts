// Property Types
export const PROPERTY_TYPES = [
  { label: 'Chung cư', value: 'apartment' },
  { label: 'Nhà trọ', value: 'hostel' },
  { label: 'Ký túc xá', value: 'dormitory' },
  { label: 'Khác', value: 'other' },
] as const

// Property Status Options
export const PROPERTY_STATUS_OPTIONS = [
  { label: 'Hoạt động', value: 'active' },
  { label: 'Bảo trì', value: 'maintenance' },
  { label: 'Không hoạt động', value: 'inactive' },
] as const

// Property Status Labels (for display)
export const PROPERTY_STATUS_LABELS = {
  active: 'Hoạt động',
  maintenance: 'Bảo trì',
  inactive: 'Không hoạt động',
} as const

// Property Type Labels (for display)
export const PROPERTY_TYPE_LABELS = {
  apartment: 'Chung cư',
  hostel: 'Nhà trọ',
  dormitory: 'Ký túc xá',
  other: 'Khác',
} as const

// Property Status Severity (for UI components)
export const PROPERTY_STATUS_SEVERITY = {
  active: 'success',
  maintenance: 'warn',
  inactive: 'danger',
} as const

// Default Property Values
export const DEFAULT_PROPERTY_VALUES = {
  type: 'hostel',
  status: 'active',
  floors: undefined,
  electricityPricePerKwh: undefined,
  waterPricePerM3: undefined,
} as const
