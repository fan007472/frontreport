import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { store } from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import 'element-plus/lib/theme-chalk/display.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import '@/mock/index'
import '@/permission'
import 'nprogress/nprogress.css'
import '@/assets/index.css'
import 'default-passive-events'

createApp(App)
    .use(store)
    .use(router)
    .use(ElementPlus, { locale })
    .mount('#app')
