<template>
    <div class='lossRun'>
        <el-form :inline='false' :model='queryForm' ref='queryFormRef'>
            <el-form-item label='Insured Name' prop='isrd_nm' class='m-form-label-class'>
                <el-input v-model='queryForm.isrd_nm' clearable @blur='getIsrdNmList'></el-input>
            </el-form-item>
            <el-form-item label='Accurate Insured Name' prop='isrd_list' class='m-form-label-class'>
                <el-select v-model='queryForm.isrd_list' multiple clearable collapse-tags collapse-tags-tooltip placeholder='请勾选被保人' :disabled='sflag' class='m-select-class'>
                    <el-option v-for='item in isrd_name' :key='item.value' :label='item.label' :value='item.value' />
                </el-select>
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
                <el-button type='primary'  @click='centerDialogVisible=true' icon='el-icon-refresh'>批量报表下载（*多被保人）</el-button>
            </el-form-item>
        </el-form>
        <el-divider content-position='center' class='m-driver-class'>保费和赔款为100%份额的数据</el-divider>
        <el-table :data='tableData' size='small' :header-cell-style='tableHeadStyle' :row-style='tableDataStyle' :summary-method='getSummaries'
                  show-summary :cell-style='mcellStyle'>
            <el-table-column label=' ' >
                <el-table-column prop='policyyear' label='保单年度' width='70' />
                <el-table-column prop='policyno' label='保单号' width='100' />
                <el-table-column prop='currency' label='币种' width='45' />
                <el-table-column prop='policyfrom' label='保单起期' width='90' />
                <el-table-column prop='policyend' label='保单止期' width='90' />
                <el-table-column prop='premium' label='保费' :formatter='FormateAmount' width='100' />
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
        <div class='m-dialog'>
            <el-dialog v-model='centerDialogVisible' title='批量 Loss Ration 报表下载' center>
                <div width='100%'>
                    <!-- <el-row>
                        <el-form class='m-form'>
                            <el-form-item label='复数（被保人）录入：' label-width='12em'>
                                <el-input
                                    v-model='multi_isrd'
                                    maxlength='1000'
                                    :rows='3'
                                    type='textarea'
                                    placeholder='可输入少量多被保人，通过英文/中文半角分号【;】进行分割，导出LossRation'
                                />
                            </el-form-item>
                            <template #footer>
                                <span class='dialog-footer'>
                                    <el-button @click='centerDialogVisible = false'>Cancel</el-button>
                                    <el-button type='primary' @click='centerDialogVisible = false'
                                    >Confirm</el-button
                                    >
                                </span>
                            </template>
                        </el-form>
                    </el-row> -->
                    <!-- <el-divider content-position='center' class='m-driver-class'>如果被保人太多，请使用模板进行批量下载</el-divider> -->

                </div>
                <div>
                    <el-button type='primary' icon='el-icon-download'>
                        模板下载
                    </el-button>
                    <el-divider>
                        <el-icon><star-filled /></el-icon>
                    </el-divider>
                    <div class='m-upload'>
                        <el-upload
                            class='upload-demo'
                            drag
                            action='lossRunUploadAction'
                            accept='.xlsx,.xls'
                            :before-upload='mUpload'
                        >
                            <el-icon class='el-icon--upload' size='100'><upload-filled /></el-icon>
                            <div class='el-upload__text'>
                                Drop file here or <em>click to upload</em>
                            </div>
                            <template #tip>
                                <div class='el-upload__tip'>
                                    请上传Excel files
                                </div>
                            </template>
                        </el-upload>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script lang='ts'>
import { defineComponent, reactive, ref, unref } from 'vue'
import { resetFields } from '@/utils/formExtend'
import { exportLossRun, getInsuredList, IDictionary, getLossQueryInfo } from '@/api/components/index'
import type { ElForm } from 'element-plus'
import { format } from '@/utils/tools'
import { ElNotification } from 'element-plus'
interface ListItem {
    value: string
    label: string
}

export default defineComponent({
    name: 'LossRun',
    setup() {
        const today = new Date()
        const sflag = ref(true)
        const multi_isrd = ref()
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
        const tableDataStyle = () => {
            return 'font-weight: 400;font-size: 0.9em; font-family:&aposSegoe UI&apos;color:#000000'
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
        const getSummaries = (param:any) => {
            const { columns, data } = param
            const sums: string[] = []
            const sumpremium = data.map((item:any) => Number(item.premium)).reduce((total:number, num:number) => {
                return total + num
            }, 0)
            const sumtotalloss = data.map((item:any) => Number(item.totalloss)).reduce((total:number, num:number) => {
                return total + num
            }, 0)
            columns.forEach((column:any, index:number) => {
                if (index === 0) {
                    sums[index] = '合计'
                }
                const values = data.map((item:any) => Number(item[column.property]))
                if (index >= 5 && index <= 12) {
                    if (!values.every((value:number) => Number.isNaN(value))) {
                        sums[index] = format(`${values.reduce((prev:number, curr:number) => {
                            const value = Number(curr)
                            if (!Number.isNaN(value)) {
                                return prev + curr
                            } else {
                                return prev
                            }
                        }, 0)}`)
                    } else {
                        sums[index] = 'N/A'
                    }
                } else if (index === 13) {
                    if (sumpremium === 0) {
                        sums[index] = 'N/A'
                    } else {
                        sums[index] = `${(sumtotalloss / sumpremium * 100).toFixed(2)}%`
                    }
                }
            })
            return sums
        }
        const mcellStyle = (mcell:any) => {
            const { columnIndex } = mcell
            if (columnIndex === 13) {
                return 'background-color: hotpink;'
            }
        }
        const centerDialogVisible = ref(false)
        const mUpload = (file:any) => {
            const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1)
            const sflag0 = fileExtension === 'xls'
            const sflag1 = fileExtension === 'xlsx'
            if (!sflag0 && !sflag1) {
                ElNotification({
                    title: '文件类型失败',
                    message: '仅能上传Excel文件',
                    type: 'error'
                })
            }
        }
        const lossRunUploadAction = () => {
            alert('111111111')
        }
        return {
            lossRunUploadAction,
            mUpload,
            multi_isrd,
            centerDialogVisible,
            mcellStyle,
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
            getSummaries
        }
    }
})
</script>
<style scoped>
.m-form-label-class :deep() .el-form-item__label{
    /* color: black; */
    /* font-weight: bold; */
    width: 15em;
}
.m-driver-class :deep() .el-divider__text {
    color: red;
    font-weight: 700;
}
.m-select-class :deep() .select-trigger .el-input .el-input__inner {
    width: 45em !important;
}
.m-muti-input-class :deep() .el-form, .el-form-item__label, .el-form-item__content .el-textarea {
    width: 100% !important;
}
.m-form {
    width: 100% ;
    font-weight: 600;
}
.m-form :deep() .el-textarea {
    width: 100% ;
    font-weight: 600;
}
.el-textarea
.lossRun :deep() .el-table .el-table__footer{
    font-weight: 600;
    font-size: 0.9em;
    font-family : 'Segoe UI';
    background-color: orange;
    color: #000000
}
.m-upload :deep() .el-upload {
    width: 100%;
}
.m-upload :deep() .el-upload .el-upload-dragger {
    width: 100%;
}
.m-upload :deep() .el-upload__tip {
    font-weight: 700;
    color: red;
}
/* .m-upload :deep() .el-icon--upload {

} */
</style>
