<template>
    <div>
        <el-form :inline='false' :model='queryForm' ref='queryFormRef'>
            <el-form-item label='Insured Name' prop='isrd_nm' class='m-form-label-class'>
                <el-input v-model='queryForm.isrd_nm' clearable @blur='getIsrdNmList'></el-input>
            </el-form-item>
            <el-form-item label='Accurate Insured Name' prop='isrd_list' class='m-form-label-class'>
                <!-- <el-select v-model='queryForm.isrd_list' multiple clearable placeholder='请勾选被保人' :disabled='sflag'>
                    <el-option v-for='item in isrd_name' :key='item.value' :label='item.label' :value='item.value' />
                </el-select> -->
                <el-select-v2
                    v-model='queryForm.isrd_list'
                    :options='isrd_name'
                    placeholder='如果全部符合，则不需要勾选'
                    style='width: 600px'
                    clearable
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                />
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
        <el-table :data='tableData' size='small' :header-cell-style='tableHeadStyle'>
            <el-table-column label=''>
                <el-table-column prop='name' label='保单年度' width='80' />
                <el-table-column prop='name' label='保单号' width='100' />
                <el-table-column prop='name' label='币种' width='60' />
                <el-table-column prop='name' label='保费' width='120' />
            </el-table-column>
            <el-table-column label='Settled'>
                <el-table-column prop='name' label='已决赔款' width='120' />
                <el-table-column prop='name' label='已决费用' width='120' />
                <el-table-column prop='name' label='累计赔付' width='120' />
            </el-table-column>
            <el-table-column label='OutStanding Loss'>
                <el-table-column prop='name' label='未决赔款' width='120' />
                <el-table-column prop='name' label='未决费用' width='120' />
                <el-table-column prop='name' label='未决合计' width='120' />
            </el-table-column>
            <el-table-column label='Loss Total'>
                <el-table-column prop='name' label='Total Loss' width='100' />
            </el-table-column>
            <el-table-column label=''>
                <el-table-column prop='state' label='LossRatio' width='120' />
                <el-table-column prop='city' label='ZurichShare' width='90' />
                <el-table-column prop='address' label='Turnover' width='100'/>
                <el-table-column prop='zip' label='TurnoverCCY' width='110' />
            </el-table-column>
        </el-table>
    </div>
</template>
<script lang='ts'>
import { defineComponent, reactive, ref, unref } from 'vue'
import { resetFields } from '@/utils/formExtend'
import { exportLossRun, getInsuredList, IDictionary, getLossQueryInfo } from '@/api/components/index'
import type { ElForm } from 'element-plus'
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
        const queryForm = ref({
            isrd_nm: '',
            isrd_list: '',
            review_date: today,
            rate: '',
            currency: 'CNY'
        })
        const queryFormRef = ref<InstanceType<typeof ElForm>>()
        const isrd_name = ref<ListItem[]>([])
        const getIsrdNmList = async() => {
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
            sflag.value = false
        }
        const onSubmit = async() => {
            const form = unref(queryForm)
            if (!form) return
            const res = await getLossQueryInfo(form)
        }
        const downloadLossRun = async() => {
            const form = unref(queryForm)
            if (!form) return
            const res = await exportLossRun(form)
        }
        const tableHeadStyle = (row_index:any) => {
            const { rowIndex, columnIndex } = row_index
            if (rowIndex === 0 && (columnIndex === 0 || columnIndex === 4)) {
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
            if (rowIndex === 1 && columnIndex <= 3) {
                return 'background-color: white;font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 1 && columnIndex > 3 && columnIndex <= 6) {
                return 'background-color: #00FFFF; text-align:center; font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 1 && columnIndex > 6 && columnIndex <= 9) {
                return 'background-color: Orange; text-align:center; font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 1 && columnIndex === 10) {
                return 'background-color: yellow; text-align:center; font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 1 && columnIndex === 11) {
                return 'background-color: hotpink; text-align:center; font-weight: 700;font-size: 1.0em; font-familiy:&aposSegoe UI&apos;color:#000000'
            }
            if (rowIndex === 1 && columnIndex > 11) {
                return 'background-color: white;color:#000000'
            }
        }
        const tableData = reactive([{
            name: 'Tom',
            state: 'California',
            city: 'Los Angeles',
            address: 'No. 189, Grove St, Los Angeles',
            zip: 'CA 90036'
        }])
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
            tableHeadStyle
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
</style>
