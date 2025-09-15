import { ROUTER_NAME_LIST } from '@/constants/routers'

export const SIDE_BAR_MENU = [
  {
    key: 'overview',
    label: 'Tổng quan',
    icon: 'pi pi-chart-pie',
    route: ROUTER_NAME_LIST.PROPERTY.OVERVIEW,
  },
  {
    key: 'rooms',
    label: 'Phòng',
    icon: 'pi pi-home',
    route: ROUTER_NAME_LIST.PROPERTY.ROOMS,
  },
  {
    key: 'tenants',
    label: 'Người thuê',
    icon: 'pi pi-users',
    route: ROUTER_NAME_LIST.PROPERTY.TENANTS,
  },
  {
    key: 'contracts',
    label: 'Hợp đồng',
    icon: 'pi pi-address-book',
    route: ROUTER_NAME_LIST.PROPERTY.CONTRACTS,
  },

  {
    key: 'utility-readings',
    label: 'Công tơ',
    icon: 'pi pi-bolt',
    route: ROUTER_NAME_LIST.PROPERTY.UTILITY_READINGS,
  },
  {
    key: 'invoices',
    label: 'Hóa đơn',
    icon: 'pi pi-receipt',
    route: ROUTER_NAME_LIST.PROPERTY.INVOICES,
  },
  {
    key: 'settings',
    label: 'Cài đặt',
    icon: 'pi pi-cog',
    route: ROUTER_NAME_LIST.PROPERTY.SETTINGS.DEFAULT,
    children: [
      {
        key: 'general-settings',
        label: 'Cài đặt chung',
        icon: 'pi pi-cog',
        route: ROUTER_NAME_LIST.PROPERTY.UTILITY_METERS,
      },
      {
        key: 'utility-meter-settings',
        label: 'Cài đặt công tơ',
        icon: 'pi pi-bolt',
        route: ROUTER_NAME_LIST.PROPERTY.UTILITY_METERS,
      },
      {
        key: 'extra-fee-settings',
        label: 'Cài đặt phí dịch vụ khác',
        icon: 'pi pi-dollar',
        route: ROUTER_NAME_LIST.PROPERTY.UTILITY_METERS,
      },
    ],
  },
]
