// router.ts
import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
  RouteRecordRaw,
} from 'vue-router'
import useFirebase from '../composables/useFirebase'

const { user } = useFirebase()

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../screens/Dashboard.vue'),
    meta: {
      logInRequired: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../screens/NotFound.vue'),
    meta: {
      logInRequired: false,
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
  {
    path: '/booking/:id',
    component: () => import('../screens/Booking.vue'),
    meta: {
      logInRequired: true,
    },
  },
  {
    path: '/booking/:id/seats',
    component: () => import('../screens/Seats.vue'),
    name: 'Seats',
    meta: {
      logInRequired: true,
    },
    beforeEnter: (to, from, next) => {
      if (to.query.passengers === undefined) {
        next('/404')
      } else {
        next()
      }
    },
  },
  {
    path: '/account/bookings',
    component: () => import('../screens/Account/Bookings.vue'),
    meta: {
      logInRequired: true,
    },
  },
  {
    path: '/account/bookings/:id',
    component: () => import('../screens/Account/BookingDetail.vue'),
    meta: {
      logInRequired: true,
    },
  },
  {
    path: '/account/settings',
    component: () => import('../screens/Account/Settings.vue'),
    meta: {
      logInRequired: true,
    },
  },
  {
    path: '/account/reviews',
    component: () => import('../screens/Account/Reviews.vue'),
    meta: {
      logInRequired: true,
    },
  },
  {
    path: '/admin/',
    component: () => import('../screens/Admin/Dashboard.vue'),
    meta: {
      logInRequired: true,
      admin: true,
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.admin && to.meta.admin === true) {
        user.value?.getIdTokenResult().then(idTokenResult => {
          if (!!idTokenResult.claims.admin) {
            next()
          } else {
            next('/')
          }
        })
      } else {
        next()
      }
    },
  },
  {
    path: '/admin/:id',
    component: () => import('../screens/Admin/Reviews.vue'),
    meta: {
      logInRequired: true,
      admin: true,
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.admin && to.meta.admin === true) {
        user.value?.getIdTokenResult().then(idTokenResult => {
          if (!!idTokenResult.claims.admin) {
            next()
          } else {
            next('/')
          }
        })
      } else {
        next()
      }
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
