/* eslint-disable prefer-destructuring */
import axios, { AxiosResponse, AxiosError } from 'axios'
import { ElLoading, ElNotification } from 'element-plus'
import { store } from '@/store/index'
import { utf8ByteToUnicodeStr } from './tools'

const MybaseURL = ''

let loading:{close():void}
const downloadrequest = axios.create({
    // API 请求的默认前缀
    baseURL: MybaseURL,
    responseType: 'arraybuffer'
})

const errorHandler = (error: AxiosError) => {
    const stitle = '请求失败!'
    let { message } = error
    if (error.response?.status === 404) {
        message = `文件下载失败！HTTP Code:${error.response?.status}`
    }
    loading.close()
    ElNotification({
        title: stitle,
        message: message,
        type: 'error'
    })
    return Promise.reject(error)
}

// request interceptor
downloadrequest.interceptors.request.use(config => {
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
downloadrequest.interceptors.response.use((response:AxiosResponse<IResponse>) => {
    loading.close()
    const heads = response.headers
    const svalue = heads['content-type'].split(';')[0]
    if (svalue === 'application/json') {
        // const remessage = ToJsonString(response.data)
        const { message } = ToJsonString(response.data)
        ElNotification({
            title: '下载失败！',
            message: message, // response.data.message,
            type: 'error'
        })
    } else {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const filedownload = require('js-file-download')
        let filename = heads['content-disposition'].split(';')[1].split('filename=')[1]
        const contentType = heads['content-type']
        filename = decodeURIComponent(filename)
        filedownload(response.data, filename, contentType)
    }
    return response
}, errorHandler)

function ToJsonString(JsonArray:unknown) {
    return JSON.parse(utf8ByteToUnicodeStr(Array.from(new Uint8Array(JsonArray as ArrayBuffer))))
}

export default downloadrequest
