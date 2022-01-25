import { IMenubarList } from '@/type/layout'
// import { listToTree } from '@/utils/tools'
import { store } from '@/store/index'

// 动态路由名称映射表
const files = require.context('../views', true, /\.vue$/)

const components:IObject<() => Promise<typeof import('*.vue')>> = {
    Layout: ((() => import('@/layout/index.vue')) as unknown as () => Promise<typeof import('*.vue')>)
}
// console.log('=========================================2')

files.keys().forEach(file => {
    const nameMatch = file.match(/^\.\/(.*)\.vue/)
    if (!nameMatch) return
    if (nameMatch[1].includes('Dashboard') || nameMatch[1].includes('User') || nameMatch[1].includes('ErrorPage')) return
    // 如果页面以Index命名，则使用父文件夹作为name
    const indexMatch = nameMatch[1].match(/(.*)\/Index$/i)
    let name = indexMatch ? indexMatch[1] : nameMatch[1];
    [name] = name.split('/').splice(-1)
    components[name] = files(file).default as () => Promise<typeof import('*.vue')>
})
// console.log(components)
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
    const routerList:IMenubarList[] = data /** const listToTree(data, 1)*/
    asyncRouter.forEach(v => {
        routerList.push(v)
    })
    // const f = (data:IMenubarList[], pData:IMenubarList|null) => {
    const f = (data:IMenubarList[]) => {
        for (let i = 0, len = data.length; i < len; i++) {
            const v:IMenubarList = data[i]
            if (typeof v.component === 'string') v.component = components[v.component]
            // if (!v.meta.permission || (pData && v.meta.permission.length === 0)) {
            //     v.meta.permission = pData && pData.meta && pData.meta.permission ? pData.meta.permission : []
            // }
            if (v.children && v.children.length > 0) {
                f(v.children)
            }
        }
    }
    f(routerList)
    // console.log(routerList)
    store.commit('layout/setRoutes', routerList)
}

export {
    components,
    generatorDynamicRouter
}
