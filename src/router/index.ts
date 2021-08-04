import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { IMenubarList } from '@/type/layout'

const components:IObject<() => Promise<typeof import('*.vue')>> = {
    Layout: (() => import('@/layout/index.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    Redirect: (() => import('@/layout/redirect.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    LayoutBlank: (() => import('@/layout/blank.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    404: (() => import('@/views/ErrorPage/404.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    Workplace: (() => import('@/views/Dashboard/Workplace.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    Login: (() => import('@/views/User/Login.vue')) as unknown as () => Promise<typeof import('*.vue')>
}

export const allowRouter: Array<IMenubarList> = [
    {
        path: '/',
        name: 'Home',
        meta: { title: '仪表盘', icon: 'el-icon-eleme' },
        component: components.Login
    },
    {
        name: 'ErrorPage',
        path: '/ErrorPage',
        meta: { title: '错误页面', hidden: true, icon: 'el-icon-eleme' },
        component: components.LayoutBlank,
        redirect: '/Error/404',
        children: [
            {
                name: '404',
                path: '/Error/404',
                component: components['404'],
                meta: { title: '404', icon: 'el-icon-s-tools' }
            }
        ]
    },
    {
        name: 'RedirectPage',
        path: '/redirect',
        component: components.Layout,
        meta: { title: '重定向页面', icon: 'el-icon-eleme', hidden: true },
        children: [
            {
                name: 'Redirect',
                path: '/redirect/:pathMatch(.*)*',
                meta: {
                    title: '重定向页面',
                    icon: ''
                },
                component: components.Redirect
            }
        ]
    },
    {
        name: 'Login',
        path: '/Login',
        component: components.Login,
        meta: { title: '登录', icon: 'el-icon-eleme', hidden: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: allowRouter as RouteRecordRaw[]
})

export default router
