import request, { getAxios } from '@/utils/request'
import downloadrequest from '@/utils/download'
import { AxiosResponse } from 'axios'
import { ref } from 'vue'
const api = {
    getTableList: '/getTableList',
    getTableColumn: '/Claim/ClaimQueryTableFields',
    expoertClaimReport: '/Claim/ClaimReportExport',
    getStockBasicInfo: '/Claim/StockInfoQuery'
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
export interface ITableColumn {
    columnName: string
    columnDesca: string
    checkFlag: string
}
export function getTableColumn(tableName: string) : Promise<AxiosResponse<IResponse<Array<ITableColumn>>>> {
    return request({
        url: api.getTableColumn,
        method: 'get',
        params: { tableName: tableName }
    })
}
export interface Option {
    value: string
    desc: string
    disabled: boolean
}
export interface IClaimQueryCondtion {
    queryColumn: string[],
    queryForm: {
        claimno: string,
        pcyno: string,
        apctnm: string
        isrdnm: string,
        clmstatus: string[],
        branch: string,
        ria_dir: string,
        clm_hdlr: string[],
        line: string[],
        rfl: string,
        claimFlag: string[],
        location: string,
        broker: string,
        accidentdate: string,
        cat: string,
        adjuster: string,
        solicitor: string,
        claimcategory: string[],
        ria_branch: string,
        registerdate: string[],
        reportdate: string[],
        closedate: string[],
        reopendate: string[]
    }
}

export function exportClaimReport(reportColumn:IClaimQueryCondtion):Promise<AxiosResponse<IResponse>> {
    return downloadrequest({
        url: `${api.expoertClaimReport}?time=${new Date()}`,
        method: 'post',
        data: reportColumn
    })
}

export interface ITest {
    queryColumn: string[],
    queryForm: {
        claimno: string,
        pcyno: string,
        apctnm: string,
        isrdnm: string,
        clmstatus: string[],
        branch: string,
        ria_dir: string,
        clm_hdlr: string[],
        line: string[],
        rfl: string,
        claimFlag: string,
        location: string,
        broker: string,
    }
}

export function exportClaimReport01(reportColumn:ITest):Promise<AxiosResponse<IResponse>> {
    return request({
        url: api.expoertClaimReport,
        method: 'post',
        data: reportColumn
    })
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getWeatherInfoAxios<T>(surl: string) {
    const result = ref<IResponse<T>|null>(null)
    const loading = ref(true)
    const loaded = ref(false)
    const error = ref(null)
    getAxios(surl, {}).then(res => {
        result.value = res.data
        loaded.value = true
        loading.value = false
    }).catch((e) => {
        error.value = e
    })
    return {
        result,
        loading,
        loaded,
        error
    }
}

export interface IStockQueryCondition{
    stock_name: string,
    ts_code: string,
    industy: string,
    market: string
}

export function getStockBasicInfo(queryForm:IStockQueryCondition): Promise<AxiosResponse<IResponse>> {
    return request({
        url: api.getStockBasicInfo,
        method: 'post',
        data: queryForm
    })
}
