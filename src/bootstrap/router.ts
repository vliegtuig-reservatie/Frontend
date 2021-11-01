// router.ts
import { createRouter, createWebHistory, Router } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../screens/Dashboard.vue'),
  },
  {
    path: '/login',
    component: () => import('../screens/Login.vue'),
  },
  {
    path: '/register',
    component: () => import('../screens/Register.vue'),
  },
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route guard
// router.beforeEach(
//   (
//     route: RouteLocationNormalized,
//     from: RouteLocationNormalized,
//     next: NavigationGuardNext,
//   ) => {
//     // Check a property that you added to the route meta
//     if (route.meta.SOMETHING) {
//       // If user is allowed
//       if (userIsAllowed) {
//         next()
//       // Else redirect to error or path, etc.
//       } else {
//         router.push(from.path)
//       }
//     }
//   },
// )

export default router
