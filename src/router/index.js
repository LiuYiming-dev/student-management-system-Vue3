import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
      {
          path:'/login',
          name:'login',
          component: () => import('../views/Login.vue'),
      },
  ],
})

// 🌟 路由全局前置守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('student_token')

    // 如果去的不是登录页，且没有token，强行跳到登录
    if (to.path !== '/login' && !token) {
        next('/login')
    } else {
        next() // 否则放行
    }
})

export default router
