import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { IMenubarList } from '@/type/layout'
import { components } from '@/router/asyncRouter'

const Components:IObject<() => Promise<typeof import('*.vue')>> = Object.assign({}, components, {
    Redirect: (() => import('@/layout/redirect.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    LayoutBlank: (() => import('@/layout/blank.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    Login: (() => import('@/views/User/Login.vue')) as unknown as () => Promise<typeof import('*.vue')>,
<<<<<<< HEAD
    404: (() => import('@/views/ErrorPage/404.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    401: (() => import('@/views/ErrorPage/404.vue')) as unknown as () => Promise<typeof import('*.vue')>,
=======
>>>>>>> frontreport/master
    Workplace: (() => import('@/views/Dashboard/Workplace.vue')) as unknown as () => Promise<typeof import('*.vue')>
})

export const allowRouter: Array<IMenubarList> = [
    {
        name: 'Dashboard',
        path: '/',
        component: Components.Layout,
        redirect: '/Dashboard/Workplace',
<<<<<<< HEAD
        meta: { title: '工作台', icon: 'el-icon-eleme' },
=======
        meta: { title: 'DashBoard', icon: 'el-icon-eleme' },
>>>>>>> frontreport/master
        children: [
            {
                name: 'Workplace',
                path: '/Dashboard/Workplace',
                component: Components.Workplace,
<<<<<<< HEAD
                meta: { title: '工作台', icon: 'el-icon-s-tools' }
=======
                meta: { title: 'DashBoard', icon: 'el-icon-s-tools' }
>>>>>>> frontreport/master
            }
        ]
    },
    {
        name: 'ErrorPage',
        path: '/ErrorPage',
        meta: { title: '错误页面', hidden: true, icon: 'el-icon-eleme' },
<<<<<<< HEAD
        component: Components.Layout,
        redirect: '/ErrorPage/404',
=======
        component: Components.LayoutBlank,
        redirect: '/Error/404',
>>>>>>> frontreport/master
        children: [
            {
                name: '401',
                path: '/ErrorPage/401',
                component: Components['401'],
                meta: { title: '401', icon: 'el-icon-s-tools' }
            },
            {
                name: '404',
<<<<<<< HEAD
                path: '/ErrorPage/404',
=======
                path: '/Error/404',
>>>>>>> frontreport/master
                component: Components['404'],
                meta: { title: '404', icon: 'el-icon-s-tools' }
            }
        ]
    },
    {
        name: 'RedirectPage',
        path: '/redirect',
        component: Components.Layout,
        meta: { title: '重定向页面', icon: 'el-icon-eleme', hidden: true },
        children: [
            {
                name: 'Redirect',
                path: '/redirect/:pathMatch(.*)*',
                meta: {
                    title: '重定向页面',
                    icon: ''
                },
                component: Components.Redirect
            }
        ]
    },
    {
        name: 'Login',
        path: '/Login',
        component: Components.Login,
        meta: { title: '登录', icon: 'el-icon-eleme', hidden: true }
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes: allowRouter as RouteRecordRaw[]
})

export default router
