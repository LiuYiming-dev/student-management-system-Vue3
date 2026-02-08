import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/',
            component: MainLayout,
            redirect: '/home',
            children: [
                {
                    path: 'student',
                    component: () => import('@/views/StudentView.vue'),
                    meta: { title: '学生管理' }
                },
                {
                    path: 'clazz',
                    component: () => import('@/views/ClazzView.vue'), // 🌟 确保这个文件存在
                    meta: { title: '班级管理' }
                },
                {
                    path:'home',
                    component: () => import('@/views/HomeView.vue'),
                    meta:{title: '主页'}
                }

            ]
        }
    ]
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
