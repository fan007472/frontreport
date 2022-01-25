import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { store } from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import 'element-plus/lib/theme-chalk/display.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import '@/permission'
import 'nprogress/nprogress.css'
import '@/assets/index.css'
import 'default-passive-events'

// 引入 mockjs
if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_MOCK === 'true') {
    require('@/mock')
}
console.log(process.env.NODE_ENV === 'production')

createApp(App)
    .use(store)
    .use(router)
    .use(ElementPlus, { locale })
    .mount('#app')
