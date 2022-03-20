/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { store } from '@/store/index'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { ElLoading, ElNotification } from 'element-plus'
import QS from 'qs'
const MybaseURL = '/api'

let loading:{close():void}
// 创建 axios 实例
const request = axios.create({
    // API 请求的默认前缀
    baseURL: MybaseURL,
    timeout: 60000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error: AxiosError) => {
    const stitle = '请求失败!'
    let { message } = error
    if (error.response?.status === 500 || error.response?.status === 504 || error.response?.status === 404) {
        message = `服务器无法访问！HTTP Code:${error.response?.status}`
    }
    if (error.response?.status === 403) {
        message = `权限不足! HTTP Code:${error.response?.status}`
    }
    if (error.response?.status === 401) {
        message = `尚未登陆！HTTP Code:${error.response?.status}`
    }
    loading.close()
    // console.log(`err${error}`)
    // console.log(error)
    ElNotification({
        title: stitle,
        message: message,
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
    let title = '请求成功'
    const { data } = response
    loading.close()
    if (data.code !== 200) {
        if (data.code === 401) {
            if (store.state.layout.token.ACCESS_TOKEN) {
                store.commit('layout/logout')
            }
            title = '身份认证失败'
        }
        ElNotification({
            title,
            message: data.message,
            type: 'error'
        })
        return Promise.reject(new Error(data.message || 'Error'))
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
