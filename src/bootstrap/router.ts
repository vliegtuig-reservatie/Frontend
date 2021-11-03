// router.ts
import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
} from 'vue-router'
import useFirebase from '../composables/useFirebase'

const { user } = useFirebase()

const routes = [
  {
    path: '/',
    component: () => import('../screens/Dashboard.vue'),
    meta: {
      logInRequired: true,
    },
  },
  {
    path: '/login',
    component: () => import('../screens/Login.vue'),
    meta: {
      logInRequired: false,
    },
  },
  {
    path: '/register',
    component: () => import('../screens/Register.vue'),
    meta: {
      logInRequired: false,
    },
  },
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    if (to.meta.logInRequired && to.meta.logInRequired === true) {
      if (user.value) {
        next()
      } else {
        next('/login')
      }
    } else {
      next()
    }
  },
)

export default router
