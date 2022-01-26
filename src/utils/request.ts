/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { store } from '@/store/index'
import axios, { AxiosResponse } from 'axios'
import { ElLoading, ElNotification } from 'element-plus'
import QS from 'qs'
const MybaseURL = ''

let loading:{close():void}
// 创建 axios 实例
const request = axios.create({
    // API 请求的默认前缀
    baseURL: MybaseURL,
    timeout: 60000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error:{message:string}) => {
    loading.close()
    // console.log(`err${error}`)
    // console.log(error)
    ElNotification({
        title: '请求失败!服务器异常！',
        message: error.message,
        type: 'error'
    })
    return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
    loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.4)'
    })
    const token = store.state.layout.token.ACCESS_TOKEN
    // 如果 token 存在
    // 让每个请求携带自定义 token 请根据实际情况自行修改
    if (token) {
        config.headers.Authorization = token
    }
    return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response:AxiosResponse<IResponse>) => {
    if (response.status && response.status === 200) {
        loading.close()
        const title = '请求成功'
        const { data } = response
        if (data.code === 401 || data.code === 402 || data.code === 403 || data.code === 500) {
            if (store.state.layout.token.ACCESS_TOKEN) {
                store.commit('layout/logout')
            }
            ElNotification({
                title,
                message: data.message,
                type: 'error'
            })
            return Promise.reject(new Error(data.message || 'Error'))
        }
    }
    return response
}, errorHandler)

export function getAxios(url:string, params:any):Promise<AxiosResponse<IResponse>> {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}

export function postAxios(url:string, params:any):Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
        axios.post(url, QS.stringify(params))
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}

export default request
