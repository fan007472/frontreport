import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "@/views/Login.vue";
import M404 from "@/views/Error/404.vue";
import LayoutBlank from "@/views/blank.vue";
import Layout from "@/layout/index.vue";
import Redirect from "@/layout/redirect.vue"

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Login
  },
  {
    name: "ErrorPage",
    path: "/ErrorPage",
    meta: { title: "错误页面", hidden: true, icon: "el-icon-eleme" },
    component: LayoutBlank,
    redirect: "/Error/404",
    children: [
      {
        name: "404",
        path: "/Error/404",
        component: M404,
        meta: { title: "404", icon: "el-icon-s-tools" }
      }
    ]
  },
  {
    name: 'RedirectPage',
    path: '/redirect',
    component : Layout,
    meta: { title: '重定向页面', icon: 'el-icon-eleme', hidden: true },
    children: [
        {
            name: 'Redirect',
            path: '/redirect/:pathMatch(.*)*',
            meta: {
                title: '重定向页面',
                icon: ''
            },
            component: Redirect
        }
    ]
},
  {
    name: "Login",
    path: "/Login",
    component: Login,
    meta: { title: "登录", icon: "el-icon-eleme", hidden: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
