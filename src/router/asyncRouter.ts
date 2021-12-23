import { IMenubarList } from '@/type/layout'
import { listToTree } from '@/utils/tools'
import { store } from '@/store/index'
// import { components } from '@/router/index'
// 动态路由名称映射表
// const files = require.context('../views', true, /\.vue$/)

const components:IObject<() => Promise<typeof import('*.vue')>> = {
    Layout: (() => import('@/layout/index.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    Login: (() => import('@/views/User/Login.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    404: (() => import('@/views/ErrorPage/404.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    Workplace: (() => import('@/views/Dashboard/Workplace.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    ClaimQuery: (() => import('@/views/Claim/ClaimQuery.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    ClaimCirc: (() => import('@/views/Claim/ClaimCirc.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    ClaimCheque: (() => import('@/views/Claim/ClaimCheque.vue')) as unknown as () => Promise<typeof import('*.vue')>
}
// console.log('============================')
// files.keys().forEach(file => {
//     const nameMatch = file.match(/^\.\/(.*)\.vue/)
//     if (!nameMatch) return
//     if (nameMatch[1].includes('ClaimQuery')) {
//         console.log('00000')
//         return
//     }
//     // 如果页面以Index命名，则使用父文件夹作为name
//     const indexMatch = nameMatch[1].match(/(.*)\/Index$/i)
//     let name = indexMatch ? indexMatch[1] : nameMatch[1];
//     [name] = name.split('/').splice(-1)
//     // console.log('1111')
//     // console.log(files(file).default)
//     // console.log(file(key))
//     // console.log(components.Layout)
//     // console.log('============================2')
//     components[name] = files(file).default as () => Promise<typeof import('*.vue')>
// })
const asyncRouter:IMenubarList[] = [
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: components['404'],
        meta: {
            title: 'NotFound',
            icon: '',
            hidden: true
        },
        redirect: {
            name: '404'
        }
    }
]

const generatorDynamicRouter = (data:IMenubarList[]):void => {
    const routerList:IMenubarList[] = listToTree(data, 0)
    asyncRouter.forEach(v => {
        routerList.push(v)
    })
    const f = (data:IMenubarList[], pData:IMenubarList|null) => {
        for (let i = 0, len = data.length; i < len; i++) {
            const v:IMenubarList = data[i]
            if (typeof v.component === 'string') v.component = components[v.component]
            if (!v.meta.permission || (pData && v.meta.permission.length === 0)) {
                v.meta.permission = pData && pData.meta && pData.meta.permission ? pData.meta.permission : []
            }
            if (v.children && v.children.length > 0) {
                f(v.children, v)
            }
        }
    }
    f(routerList, null)
    store.commit('layout/setRoutes', routerList)
}

export {
    components,
    generatorDynamicRouter
}
