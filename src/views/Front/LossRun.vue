<template>
    <div>
        <el-form :inline='false' :model='queryForm' ref='queryFormRef'>
            <el-form-item label='Insured Name' prop='isrd_nm' class='m-form-label-class'>
                <el-input v-model='queryForm.isrd_nm' clearable @blur='getIsrdNmList'></el-input>
            </el-form-item>
            <el-form-item label='Accurate Insured Name' prop='isrd_list' class='m-form-label-class'>
                <el-select v-model='queryForm.isrd_list' multiple clearable collapse-tags collapse-tags-tooltip placeholder='请勾选被保人' :disabled='sflag' class='m-select-class'>
                    <el-option v-for='item in isrd_name' :key='item.value' :label='item.label' :value='item.value' />
                </el-select>
                <!-- <el-select-v2
                    v-model='queryForm.isrd_list'
                    :options='isrd_name'
                    :disabled='sflag'
                    placeholder='如果全部符合，则不需要勾选'
                    style='width: 600px'
                    clearable
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    @blur='testV2'
                    @clear='testV2'
                /> -->
            </el-form-item>
            <template v-if='expandMore'>
                <el-form-item label='Review Date' class='m-form-label-class' prop='review_date'>
                    <el-date-picker v-model='queryForm.review_date'  class='m-form-label-class' placeholder='Pick a day' />
                </el-form-item>
                <el-form-item label='Currency Rate(CNY-USD)' prop='rate'  class='m-form-label-class'>
                    <el-input v-model='queryForm.rate' clearable></el-input>
                </el-form-item>
                <el-form-item label='Chosse Currency' prop='currency' class='m-form-label-class'>
                    <el-select v-model='queryForm.currency'>
                        <el-option value='CNY' label='CNY' />
                        <el-option value='USD' label='USD' />
                    </el-select>
                </el-form-item>
            </template>
            <el-form-item>
                <el-button type='primary' @click='onSubmit(queryForm)' style='margin-left: 1em' icon='el-icon-search'>查询</el-button>
                <el-button type='warning' @click='resetFields(queryFormRef)' icon='el-icon-refresh'>清除</el-button>
                <el-button type='success' @click='downloadLossRun(queryFormRef)' icon='el-icon-refresh'>报表下载</el-button>
                <el-button :icon='expandMore ? &apos;el-icon-arrow-up&apos; : &apos;el-icon-arrow-down&apos;' type='text' @click='expandMore = !expandMore'>{{
                    expandMore ? '更多查询条件：收起' : '更多查询条件：展开'
                }}</el-button>
            </el-form-item>
        </el-form>
        <el-divider content-position='center' class='m-driver-class'>保费和赔款为100%份额的数据</el-divider>
        <el-table :data='tableData' size='small' :header-cell-style='tableHeadStyle' :row-style='tableDataStyle'>
            <el-table-column label=' ' >
                <el-table-column prop='policyyear' label='保单年度' width='70' />
                <el-table-column prop='policyno' label='保单号' width='100' />
                <el-table-column prop='currency' label='币种' width='45' />
                <el-table-column prop='premium' label='保费' :formatter='FormateAmount' width='100' />
                <el-table-column prop='policyfrom' label='保单起期' width='90' />
                <el-table-column prop='policyend' label='保单止期' width='90' />
            </el-table-column>
            <el-table-column label='Settled'>
                <el-table-column prop='pay_i' label='已决赔款' :formatter='FormateAmount' width='100' />
                <el-table-column prop='pay_e' label='已决费用' :formatter='FormateAmount' width='100' />
                <el-table-column prop='totalpaid' label='累计赔付' :formatter='FormateAmount' width='100' />
            </el-table-column>
            <el-table-column label='OutStanding Loss'>
                <el-table-column prop='ind_i' label='未决赔款' :formatter='FormateAmount' width='100' />
                <el-table-column prop='ind_e' label='未决费用' :formatter='FormateAmount' width='100' />
                <el-table-column prop='totalreserve' label='未决合计' :formatter='FormateAmount' width='100' />
            </el-table-column>
            <el-table-column label='Loss Total'>
                <el-table-column prop='totalloss' label='Total Loss' :formatter='FormateAmount' width='80' />
            </el-table-column>
            <el-table-column label=' '>
                <el-table-column prop='combinedlossration' label='ComLossRatio' :formatter='FormatPercentage' width='110' />
                <el-table-column prop='zurichshare' label='ZurichShare' :formatter='FormatPercentage' width='90' />
                <el-table-column prop='turnover' label='营业额' :formatter='FormateAmount' width='100'/>
                <el-table-column prop='turnoverccy' label='币种' width='45' />
                <el-table-column prop='reinsureflag' label='再保' width='60'/>
                <el-table-column prop='claimnumber' label='案件数' width='60'/>
                <el-table-column fixed='right' prop='tmrnm' label='渠道人员'/>
            </el-table-column>
        </el-table>
    </div>
</template>
<script lang='ts'>
import { defineComponent, reactive, ref, unref } from 'vue'
import { resetFields } from '@/utils/formExtend'
import { exportLossRun, getInsuredList, IDictionary, getLossQueryInfo } from '@/api/components/index'
import type { ElForm } from 'element-plus'
import { format } from '@/utils/tools'
import { clear } from 'console'

interface ListItem {
    value: string
    label: string
}

export default defineComponent({
    name: 'LossRun',
    setup() {
        const today = new Date()
        const sflag = ref(true)
        const expandMore = ref(false)
        const tableData = ref([])
        const queryForm = ref({
            isrd_nm: '',
            isrd_list: [],
            review_date: today,
            rate: '',
            currency: 'CNY'
        })
        const queryFormRef = ref<InstanceType<typeof ElForm>>()
        const isrd_name = ref<ListItem[]>([])
        const getIsrdNmList = async() => {
            sflag.value = false
            queryForm.value.isrd_list = []
            isrd_name.value = []
            const { isrd_nm } = queryForm.value
            const res = await getInsuredList(isrd_nm)
            const isrdList: Array<IDictionary> = res.data.obj
            isrdList.forEach((v: IDictionary) => {
                isrd_name.value.push({
                    value: v.keyValue,
                    label: v.keyDesc
                })
            })
        }
        const FormateAmount = (row: any, column: any, cellValue: any) => {
            if (queryForm.value.currency === 'USD') {
                return format(cellValue, '$')
            }
            return format(cellValue)
        }
        const FormatPercentage = (row: any, column: any, cellValue: any) => {
            return `${(cellValue * 100).toFixed(2)}%`
        }
        const onSubmit = async() => {
            const form = unref(queryForm)
            if (!form) return
            const res = await getLossQueryInfo(form)
            tableData.value = res.data.obj
            sflag.value = true
        }
        const downloadLossRun = async() => {
            const form = unref(queryForm)
            if (!form) return
            const res = await exportLossRun(form)
        }
        const tableDataStyle = (rowData:any) => {
            return 'font-weight: 400;font-size: 0.9em; font-familiy:&aposSegoe UI&apos;color:#000000'
        }
        const tableHeadStyle = (row_index:any) => {
            const { rowIndex, columnIndex } = row_index
            if (rowIndex === 0 && (columnIndex === 0 || columnIndex === 6)) {
                return 'background-color: white;'
            }
            if (rowIndex === 0 && columnIndex === 1) {
                return 'background-color: #00FFFF; text-align:center; font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 0 && columnIndex === 2) {
                return 'background-color: Orange; text-align:center; font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 0 && columnIndex === 3) {
                return 'background-color: yellow; text-align:center; font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 0 && columnIndex === 0) {
                return 'background-color: white;'
            }
            if (rowIndex === 0 && columnIndex >= 4) {
                return 'background-color: white;'
            }
            if (rowIndex === 1 && columnIndex <= 5) {
                return 'background-color: white;font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 1 && columnIndex > 5 && columnIndex <= 8) {
                return 'background-color: #00FFFF; text-align:center; font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 1 && columnIndex > 8 && columnIndex <= 11) {
                return 'background-color: Orange; text-align:center; font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 1 && columnIndex === 12) {
                return 'background-color: yellow; text-align:center; font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 1 && columnIndex === 13) {
                return 'background-color: hotpink; text-align:center; font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 1 && columnIndex > 13) {
                return 'background-color: white;color:#000000'
            }
        }
        const testV2 = () => {
            alert(1111)
            queryForm.value.isrd_list = []
            isrd_name.value = []
            console.log(queryForm)
        }
        return {
            queryForm,
            sflag,
            resetFields,
            onSubmit,
            downloadLossRun,
            getIsrdNmList,
            isrd_name,
            queryFormRef,
            expandMore,
            tableData,
            FormateAmount,
            FormatPercentage,
            tableDataStyle,
            tableHeadStyle,
            testV2
        }
    }
})
</script>
<style scoped>
.m-form-label-class :deep() .el-form-item__label{
    /* color: black; */
    /* font-weight: bold; */
    width: 200px;
}
.m-driver-class :deep() .el-divider__text {
    color: red;
    font-weight: 700;
}
.m-select-class >>> .select-trigger .el-input .el-input__inner {
    width: 600px !important;
}
</style>
