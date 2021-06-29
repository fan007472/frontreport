import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import M404 from '../views/Error/404.vue'
import LayoutBlank from '../views/blank.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Login
  },
    {
      name: 'ErrorPage',
      path: '/ErrorPage',
      meta: { title: '错误页面', hidden: true, icon: 'el-icon-eleme' },
      component: LayoutBlank,
      redirect: '/Error/404',
      children: [
          {
              name: '404',
              path: '/Error/404',
              component: M404,
              meta: { title: '404', icon: 'el-icon-s-tools' }
          }
      ]
  },
  {
    name: 'Login',
    path: '/Login',
    component: Login,
    meta: { title: '登录', icon: 'el-icon-eleme', hidden: true }
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
