import  request, { getAxios } from '@/utils/request'
import { AxiosResponse } from 'axios'
import { ref } from 'vue'
const api = {
    getTableList: '/getTableList'
}
export type ITag = '所有' | '家' | '公司' | '学校' | '超市'
export interface ITableList {
    page: number
    size: number
    tag: ITag
}
export function getTableList(tableList: ITableList): Promise<AxiosResponse<IResponse>> {
    return request({
        url: api.getTableList,
        method: 'get',
        data: tableList
    })
}

export function getWeatherInfoAxios<T>(surl: string) {
    const result = ref<IResponse<T>|null>(null)
    const loading = ref(true)
    const loaded = ref(false)
    const error = ref(null)
    getAxios(surl, {}).then(res =>{
        result.value = res.data
        loaded.value = true
        loading.value = false
    }).catch((e) =>{
        error.value = e
    })
    return {
        result,
        loading,
        loaded,
        error
    }
}