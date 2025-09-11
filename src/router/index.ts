import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/auth/useAuth'
import { ROUTER_NAME_LIST } from '@/constants/routers'
import LoginPage from '@/views/LoginPage.vue'
import RentalManagement from '@/views/RentalManagement.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'

const { token } = useAuth()

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
      meta: { requiresAuth: false, transition: 'slide-fade' },
    },
    { path: `/:notFound(.*)`, component: NotFoundPage },
  ],
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !token.value) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
