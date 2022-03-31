import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { store } from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import 'element-plus/lib/theme-chalk/display.css'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
import '@/permission'
import 'nprogress/nprogress.css'
import '@/assets/index.css'
import 'default-passive-events'
import * as ElIconModules from '@element-plus/icons'

// 引入 mockjs
if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_MOCK === 'true') {
    require('@/mock')
}
console.log(process.env.NODE_ENV === 'production')

const app = createApp(App)

app.use(store)
    .use(router)
    .use(ElementPlus)
    .mount('#app')

for (const iconName in ElIconModules) {
    if (Reflect.has(ElIconModules, iconName)) {
        const item = ElIconModules[iconName]
        app.component(iconName, item)
    }
}
