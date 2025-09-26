import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/auth/useAuth'
import { ROUTER_NAME_LIST } from '@/constants/routers'
import LoginPage from '@/views/LoginPage.vue'
import RentalManagement from '@/views/RentalManagement.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'

const { token } = useAuth()
const PREFIX_PROPERTY = '/property/:id'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: ROUTER_NAME_LIST.LOGIN_PAGE,
      component: LoginPage,
      meta: { transition: 'slide-fade' },
    },
    {
      path: '/home',
      name: ROUTER_NAME_LIST.HOME_PAGE,
      component: RentalManagement,
      meta: { requiresAuth: true, transition: 'slide-fade' },
    },
    {
      path: `${PREFIX_PROPERTY}/overview`,
      name: ROUTER_NAME_LIST.PROPERTY.OVERVIEW,
      component: () => import('@/views/PropertyOverviewPage.vue'),
      meta: { requiresAuth: true, transition: 'slide-fade' },
    },
    {
      path: `${PREFIX_PROPERTY}/rooms`,
      name: ROUTER_NAME_LIST.PROPERTY.ROOMS,
      component: () => import('@/views/PropertyRoomsPage.vue'),
      meta: { requiresAuth: true, transition: 'slide-fade' },
    },
    {
      path: `${PREFIX_PROPERTY}/tenants`,
      name: ROUTER_NAME_LIST.PROPERTY.TENANTS,
      component: () => import('@/views/PropertyTenantsPage.vue'),
      meta: { requiresAuth: true, transition: 'slide-fade' },
    },
    {
      path: `${PREFIX_PROPERTY}/contracts`,
      name: ROUTER_NAME_LIST.PROPERTY.CONTRACTS,
      component: () => import('@/views/PropertyContractsPage.vue'),
      meta: { requiresAuth: true, transition: 'slide-fade' },
    },
    {
      path: `${PREFIX_PROPERTY}/utility-readings`,
      name: ROUTER_NAME_LIST.PROPERTY.UTILITY_READINGS,
      component: () => import('@/views/PropertyUtilityReadingsPage.vue'),
      meta: { requiresAuth: true, transition: 'slide-fade' },
    },
    {
      path: `${PREFIX_PROPERTY}/invoices`,
      name: ROUTER_NAME_LIST.PROPERTY.INVOICES,
      component: () => import('@/views/PropertyInvoicesPage.vue'),
      meta: { requiresAuth: true, transition: 'slide-fade' },
    },
    {
      path: `${PREFIX_PROPERTY}/settings`,
      name: ROUTER_NAME_LIST.PROPERTY.SETTINGS.DEFAULT,
      component: () => import('@/views/PropertySettingsPage.vue'),
      meta: { requiresAuth: true, transition: 'slide-fade' },
    },
    {
      path: `${PREFIX_PROPERTY}/settings/general`,
      name: ROUTER_NAME_LIST.PROPERTY.SETTINGS.GENERAL,
      component: () => import('@/views/PropertyGeneralSettingsPage.vue'),
      meta: { requiresAuth: true, transition: 'slide-fade' },
    },
    {
      path: `${PREFIX_PROPERTY}/settings/utility-meter`,
      name: ROUTER_NAME_LIST.PROPERTY.SETTINGS.UTILITY_METER,
      component: () => import('@/views/PropertyUtilityMeterSettingsPage.vue'),
      meta: { requiresAuth: true, transition: 'slide-fade' },
    },
    {
      path: `${PREFIX_PROPERTY}/settings/extra-fee`,
      name: ROUTER_NAME_LIST.PROPERTY.SETTINGS.EXTRA_FEE,
      component: () => import('@/views/PropertyExtraFeeSettingsPage.vue'),
      meta: { requiresAuth: true, transition: 'slide-fade' },
    },
    { path: `/:notFound(.*)`, component: NotFoundPage },
  ],
})

router.beforeEach((to, _from, next) => {
  if (to.name === ROUTER_NAME_LIST.LOGIN_PAGE && token.value) {
    next({ name: ROUTER_NAME_LIST.HOME_PAGE })
    return
  }
  if (to.meta.requiresAuth && !token.value) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
