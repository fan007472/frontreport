import { login, loginParam, getRouterList, getUser } from '@/api/layout/index'
import { ILayout, IMenubarStatus, ITagsList, IMenubarList, ISetting, IToken } from '@/type/layout'
import { ActionContext } from 'vuex'
import router, { allowRouter } from '@/router/index'
import { generatorDynamicRouter } from '@/router/asyncRouter'
import changeTheme from '@/utils/changeTheme'
import { setLocal, useLocal, getLocal, decodeUrl } from '@/utils/tools'
import { RouteLocationNormalizedLoaded } from 'vue-router'

const setting = getLocal<ISetting>('setting')
const token = getLocal<IToken>('token')
// 前端检查token是否失效
useLocal('token')
    .then(d => token.ACCESS_TOKEN === d.ACCESS_TOKEN)
    .catch(() => mutations.logout(state))

const state:ILayout = {
    menubar: {
        status: document.body.offsetWidth < 768 ? IMenubarStatus.PHN : IMenubarStatus.PCE,
        menuList: [],
        isPhone: document.body.offsetWidth < 768
    },
    // 用户信息
    userInfo: {
        name: '',
        role: []
    },
    // 标签栏
    tags: {
        tagsList: [],
        cachedViews: []
    },
    token: {
        ACCESS_TOKEN: token.ACCESS_TOKEN || ''
    },
    setting: {
        theme: setting.theme !== undefined ? setting.theme : 0,
        showTags: setting.showTags !== undefined ? setting.showTags : true,
        color: {
            primary: setting.color !== undefined ? setting.color.primary : '#409eff'
        }
    },
    isLoading: false
}
const mutations = {
    changeCollapsed(state: ILayout):void {
        if (state.menubar.isPhone) {
            state.menubar.status = state.menubar.status === IMenubarStatus.PHN ? IMenubarStatus.PHE : IMenubarStatus.PHN
        } else {
            state.menubar.status = state.menubar.status === IMenubarStatus.PCN ? IMenubarStatus.PCE : IMenubarStatus.PCN
        }
    },
    changeDeviceWidth(state: ILayout):void {
        if (document.body.offsetWidth < 768) {
            state.menubar.isPhone = true
            state.menubar.status = IMenubarStatus.PHN
        } else {
            state.menubar.isPhone = false
            state.menubar.status = IMenubarStatus.PCE
        }
    },
    // 切换导航，记录打开的导航
    changeTagNavList(state: ILayout, cRouter:RouteLocationNormalizedLoaded):void {
        if (!state.setting.showTags) return // 判断是否开启多标签页
        if (cRouter.meta.hidden && !cRouter.meta.activeMenu) return // 隐藏的菜单如果不是子菜单则不添加到标签
        const index = state.tags.tagsList.findIndex(v => v.path === cRouter.path)
        state.tags.tagsList.forEach(v => v.isActive)
        // 判断页面是否打开过
        if (index !== -1) {
            state.tags.tagsList[index].isActive = true
            return
        }
        const tagsList:ITagsList = {
            name: cRouter.name as string,
            title: cRouter.meta.title as string,
            path: cRouter.path,
            isActive: true
        }
        state.tags.tagsList.push(tagsList)
    },
    removeTagNav(state: ILayout, obj:{tagsList:ITagsList, cPath: string}):void {
        const index = state.tags.tagsList.findIndex(v => v.path === obj.tagsList.path)
        if (state.tags.tagsList[index].path === obj.cPath) {
            state.tags.tagsList.splice(index, 1)
            const i = index === state.tags.tagsList.length ? index - 1 : index
            state.tags.tagsList[i].isActive = true
            mutations.removeCachedViews(state, { name: obj.tagsList.name, index })
            router.push({ path: state.tags.tagsList[i].path })
        } else {
            state.tags.tagsList.splice(index, 1)
            mutations.removeCachedViews(state, { name: obj.tagsList.name, index })
        }
    },
    removeOtherTagNav(state: ILayout, tagsList:ITagsList):void {
        const index = state.tags.tagsList.findIndex(v => v.path === tagsList.path)
        state.tags.tagsList.splice(index + 1)
        state.tags.tagsList.splice(0, index)
        state.tags.cachedViews.splice(index + 1)
        state.tags.cachedViews.splice(0, index)
        router.push({ path: tagsList.path })
    },
    removeAllTagNav(state: ILayout):void {
        state.tags.tagsList.splice(0)
        state.tags.cachedViews.splice(0)
        router.push({ path: '/redirect/' })
    },
    // 添加缓存页面
    addCachedViews(state: ILayout, obj: {name: string, noCache: boolean}):void {
        if (!state.setting.showTags) return // 判断是否开启多标签页
        if (obj.noCache || state.tags.cachedViews.includes(obj.name)) return
        state.tags.cachedViews.push(obj.name)
    },
    // 删除缓存页面
    removeCachedViews(state: ILayout, obj: { name: string, index: number }):void {
        // 判断标签页是否还有该页面
        if (state.tags.tagsList.map(v => v.name).includes(obj.name)) return
        state.tags.cachedViews.splice(obj.index, 1)
    },
    login(state: ILayout, token :{ tokenHead: string, token: string }):void {
        state.token.ACCESS_TOKEN = `${token.tokenHead} ${token.token}`
        setLocal('token', state.token, 1000 * 60 * 60 * 24)
        const { query } = router.currentRoute.value
        router.push(typeof query.from === 'string' ? decodeUrl(query.from) : '/')
    },
    logout(state: ILayout):void {
        state.token.ACCESS_TOKEN = ''
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('menubar')
        history.go(0)
    },
    setRoutes(state: ILayout, data: Array<IMenubarList>):void {
        state.menubar.menuList = data
    },
    concatAllowRoutes(state: ILayout):void {
        allowRouter.reverse().forEach(v => state.menubar.menuList.unshift(v))
    },
    getUser(state: ILayout, userInfo:{name:string, role: Array<string>}):void {
        state.userInfo.name = userInfo.name
        state.userInfo.role = userInfo.role
    },
    // 修改主题
    changeTheme(state: ILayout, num:number):void {
        if (num === state.setting.theme) return
        if (typeof num !== 'number') num = state.setting.theme
        changeTheme(num)
        state.setting.theme = num
        localStorage.setItem('setting', JSON.stringify(state.setting))
    },
    changeTagsSetting(state: ILayout, showTags:boolean):void {
        state.setting.showTags = showTags
        localStorage.setItem('setting', JSON.stringify(state.setting))

        if (showTags) {
            const index = state.tags.tagsList.findIndex(v => v.path === router.currentRoute.value.path)
            if (index !== -1) {
                state.tags.tagsList.forEach(v => v.isActive)
                state.tags.tagsList[index].isActive = true
            } else {
                mutations.changeTagNavList(state, router.currentRoute.value)
            }
        }
    }
}
const actions = {
    async login(context:ActionContext<ILayout, IState>, param: loginParam):Promise<void> {
        const res = await login(param)
        const token = res.data.obj
        context.commit('login', token)
    },
    async getUser(context:ActionContext<ILayout, IState>):Promise<void> {
        const res = await getUser()
        const userInfo = res.data.obj
        context.commit('getUser', userInfo)
    },
    async GenerateRoutes():Promise<void> {
        // console.log('generate router')
        const res = await getRouterList()
        const { obj } = res.data
        generatorDynamicRouter(obj)
    }
}
const layoutState = {
    namespaced: true,
    state,
    mutations,
    actions
}

export default layoutState
