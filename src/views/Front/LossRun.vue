<template>
    <div>
        <el-form :inline='true' :model='queryForm' ref='queryFormRef'>
            <el-form-item label='Insured Name' prop='isrd_nm' class='m-form-label-class'>
                <el-input v-model='queryForm.isrd_nm' clearable @blur='getIsrdNmList'></el-input>
            </el-form-item>
            <el-form-item label='Accurate Insured Name' prop='isrd_list' class='m-form-label-class'>
                <el-select v-model='queryForm.isrd_list' multiple clearable placeholder='请勾选被保人' :disabled='sflag'>
                    <el-option v-for='item in isrd_name' :key='item.value' :label='item.label' :value='item.value' />
                </el-select>
            </el-form-item>
            <el-form-item label='Review Date' prop='review_date'>
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
            <el-form-item>
                <el-button type='primary' @click='onSubmit(queryForm)' style='margin-left: 1em' icon='el-icon-search'>查询</el-button>
                <el-button type='warning' @click='resetFields(queryFormRef)' icon='el-icon-refresh'>清除</el-button>
                <el-button type='success' @click='resetFields(queryFormRef)' icon='el-icon-refresh'>报表下载</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang='ts'>
import { defineComponent, ref, unref } from 'vue'
import { resetFields } from '@/utils/formExtend'
import { exportLossRun, getInsuredList, IDictionary } from '@/api/components/index'

interface ListItem {
    value: string
    label: string
}

export default defineComponent({
    name: 'LossRun',
    setup() {
        const today = new Date()
        const sflag = ref(true)
        const queryForm = ref({
            isrd_nm: '',
            isrd_list: '',
            review_date: today,
            rate: '',
            currency: 'CNY'
        })
        const isrd_name = ref<ListItem[]>([])
        const getIsrdNmList = async() => {
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
        const onSubmit = async() => {
            const form = unref(queryForm)
            if (!form) return
            const res = await exportLossRun(form)
        }
        return {
            queryForm,
            sflag,
            resetFields,
            onSubmit,
            getIsrdNmList
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
