<template>
    <div class='ClaimQuery'>
        <el-form :inline='true' :model='queryForm' ref='queryFormRef'>
            <el-form-item label='被保险人' prop='isrdnm'>
                <el-input v-model='queryForm.isrdnm' clearable></el-input>
            </el-form-item>
            <el-form-item label='案件状态' prop='clmstatus'>
                <el-select v-model='queryForm.clmstatus' multiple clearable placeholder='请选择'>
                    <el-option v-for='item in claimStatus' :key='item.value' :label='item.label' :value='item.value'> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='再保标识' prop='ria_dir'>
                <el-select v-model='queryForm.ria_dir' clearable placeholder='请选择'>
                    <el-option value='D' label='直保' />
                    <el-option value='R' label='再保' />
                </el-select>
            </el-form-item>
            <el-form-item label='理赔员' prop='clm_hdlr'>
                <el-select v-model='queryForm.clm_hdlr' multiple clearable placeholder='请选择'>
                    <el-option v-for='item in handler' :key='item.value' :label='item.label' :value='item.value'> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='产品线' prop='line'>
                <el-select v-model='queryForm.line' multiple clearable placeholder='请选择'>
                    <el-option v-for='item in lob' :key='item.value' :label='item.label' :value='item.value'> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='RC/NRC' prop='rfl'>
                <el-select v-model='queryForm.rfl' clearable placeholder='请选择'>
                    <el-option value='0' label='RC' />
                    <el-option value='1' label='NRC-NonIP' />
                    <el-option value='2' label='NRC-PC' />
                </el-select>
            </el-form-item>
            <el-form-item label='立案期间' prop='registerdate'>
                <el-date-picker
                    v-model='queryForm.registerdate'
                    type='daterange'
                    unlink-panels
                    range-separator='-'
                    start-placeholder='Start date'
                    end-placeholder='End date'
                    format='YYYY-MM-DD'
                    value-format='YYYY-MM-DD'
                    :shortcuts='shortcuts'
                    class='m-select'
                />
            </el-form-item>
            <el-form-item label='关案期间' prop='closedate'>
                <el-date-picker
                    v-model='queryForm.closedate'
                    type='daterange'
                    unlink-panels
                    range-separator='-'
                    start-placeholder='Start date'
                    end-placeholder='End date'
                    format='YYYY-MM-DD'
                    value-format='YYYY-MM-DD'
                    :shortcuts='shortcuts'
                />
            </el-form-item>
            <el-form-item label='赔案号' prop='claimno'>
                <el-input v-model='queryForm.claimno' clearable></el-input>
            </el-form-item>
            <template v-if='expandMore'>
                <el-form-item label='保单号' prop='pcyno'>
                    <el-input v-model='queryForm.pcyno' clearable></el-input>
                </el-form-item>
                <el-form-item label='投保人' prop='apctnm'>
                    <el-input v-model='queryForm.apctnm' clearable></el-input>
                </el-form-item>
                <el-form-item label='案件级别' prop='claimlevel'>
                    <el-select v-model='queryForm.claimlevel' multiple clearable placeholder='请选择'>
                        <el-option v-for='item in claimlevel' :key='item.value' :label='item.label' :value='item.value'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='巨灾' prop='claimcategory'>
                    <el-input v-model='queryForm.cat' clearable></el-input>
                </el-form-item>
                <el-form-item label='再保公司' prop='ria_branch'>
                    <el-input v-model='queryForm.ria_branch' clearable></el-input>
                </el-form-item>
                <el-form-item label='事故期间' prop='accidentdate'>
                    <el-date-picker
                        v-model='queryForm.accidentdate'
                        type='daterange'
                        unlink-panels
                        range-separator='-'
                        start-placeholder='Start date'
                        end-placeholder='End date'
                        format='YYYY-MM-DD'
                        value-format='YYYY-MM-DD'
                        :shortcuts='shortcuts'
                    />
                </el-form-item>
                <el-form-item label='报案期间' prop='reportdate'>
                    <el-date-picker
                        v-model='queryForm.reportdate'
                        type='daterange'
                        unlink-panels
                        range-separator='-'
                        start-placeholder='Start date'
                        end-placeholder='End date'
                        format='YYYY-MM-DD'
                        value-format='YYYY-MM-DD'
                        :shortcuts='shortcuts'
                    />
                </el-form-item>
                <el-form-item label='出单公司' prop='branch'>
                    <el-select v-model='queryForm.branch' clearable placeholder='请选择'>
                        <el-option value='ZBJ' label='北京分公司' />
                        <el-option value='ZSH' label='上海分公司' />
                        <el-option value='ZGD' label='广州分公司' />
                    </el-select>
                </el-form-item>
                <el-form-item label='重开期间' prop='reopendate'>
                    <el-date-picker
                        v-model='queryForm.reopendate'
                        type='daterange'
                        unlink-panels
                        range-separator='-'
                        start-placeholder='Start date'
                        end-placeholder='End date'
                        format='YYYY-MM-DD'
                        value-format='YYYY-MM-DD'
                        :shortcuts='shortcuts'
                    >
                    </el-date-picker>
                </el-form-item>
            </template>
            <el-form-item>
                <el-button type='primary' @click='onSubmit(queryForm)' style='margin-left: 1em' icon='el-icon-search'>查询</el-button>
                <el-button type='warning' @click='resetFields(queryFormRef)' icon='el-icon-refresh'>清除</el-button>
                <el-button :icon='expandMore ? &apos;el-icon-arrow-up&apos; : &apos;el-icon-arrow-down&apos;' type='text' @click='expandMore = !expandMore'>{{
                    expandMore ? '更多查询条件：收起' : '更多查询条件：展开'
                }}</el-button>
                <el-button type='success' icon='el-icon-download' @click='centerDialogVisible = true'>报表导出</el-button>
                <!-- <el-button type='primary'  @click='centerDialogExcelVisible=true' icon='el-icon-refresh'>按条件导出</el-button> -->
            </el-form-item>
        </el-form>
        <el-table :data='tableData' stripe border style='width: 100% align: center' max-height='560'>
            <el-table-column fixed prop='claimno' label='赔案号' width='150' />
            <el-table-column prop='reportno' label='报案号' width='140' />
            <el-table-column prop='policyno' label='保单号' width='120' />
            <el-table-column prop='classcode' label='险类' />
            <el-table-column prop='pcyinsured' label='被报人' width='150' />
            <el-table-column prop='reportdate' label='报案日期' width='100' />
            <el-table-column prop='registerdate' label='立案日期' width='100' />
            <el-table-column prop='sisclaimhandler' label='理赔员' />
            <el-table-column prop='losscode' label='出险原因' width='120' />
            <el-table-column prop='ifdirect' label='是否直保' :formatter='FormateReInsure' />
            <el-table-column prop='closedate' label='关案日期' width='100' />
            <el-table-column prop='reserveindemnitybsccy' label='准备金赔款' :formatter='FormateAmount' width='100' />
            <el-table-column prop='paymentindemnitybsccy' label='支付赔款' :formatter='FormateAmount' width='100' />
            <el-table-column prop='totalincurbsccy' label='总赔付' :formatter='FormateAmount' width='100' />
            <el-table-column prop='losslocation' label='出险地址' width='100' />
            <el-table-column prop='lossdescript' label='出险描述' width='150' />
            <el-table-column prop='statusupdatecontent' label='Status更新' width='120'/>
            <el-table-column prop='claiminjured' label='受伤人员' width='100' />
            <el-table-column fixed='right' prop='claimsisstatus' label='案件状态' :formatter='FormateClaimStatus' />
        </el-table>
        <div class='flex justify-end'>
            <el-pagination
                v-model:currentPage='currentPage'
                v-model:page-size='pageSize'
                :page-sizes='[10, 20, 50]'
                background
                layout='total, sizes, prev, pager, next, jumper'
                :total='totalPage'
                @size-change='handleSizeChange'
                @current-change='handleCurrentChange'
                v-show='totalPage != 0'
                hide-on-single-page
            >
            </el-pagination>
        </div>
        <div class='m_el_transfer'>
            <el-dialog v-model='centerDialogVisible' title='报表字段选择' center :width='screenWidth'>
                <el-transfer
                    v-model='queryColumn'
                    filterable
                    :props='{
                        key: &apos;value&apos;,
                        label: &apos;desc&apos;
                    }'
                    :titles='[&apos;Source&apos;, &apos;Target&apos;]'
                    :format='{
                        noChecked: &apos;${total}&apos;,
                        hasChecked: &apos;${checked}/${total}&apos;
                    }'
                    :data='columndata'
                >
                </el-transfer>
                <template #footer>
                    <span class='dialog-footer'>
                        <el-button @click='centerDialogVisible = false'>取消</el-button>
                        <el-button type='primary' @click='exportReportColumn({ queryColumn, queryForm })'>导出报表</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
        <div class='m-dialog'>
            <el-dialog v-model='centerDialogExcelVisible' title='按条件下载报表' center>
                <div>
                    <el-button type='primary' icon='el-icon-download' @click='downLoadClaimExcelTemplate'>
                        模板下载
                    </el-button>
                    <el-divider>
                        <el-icon><star-filled /></el-icon>
                    </el-divider>
                    <div class='m-upload'>
                        <el-upload
                            class='upload-demo'
                            drag
                            action='multiUploadAction'
                            accept='.xlsx,.xls'
                            :before-upload='mUpload'
                        >
                            <el-icon class='el-icon--upload' :size='iconSize'><upload-filled /></el-icon>
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

<script lang="ts">
import { defineComponent, onMounted, ref, unref, watchEffect } from 'vue'
import type { ElForm } from 'element-plus'
import { resetFields } from '@/utils/formExtend'
import { getTableColumn, ITableColumn, exportClaimReport, IClaimQueryCondtion, IDictionary, getLob, getHandler, getClaimInfo, IQueryForm } from '@/api/components/index'
import { format } from '@/utils/tools'
import { ElNotification } from 'element-plus'

interface ListItem {
    value: string
    label: string
}

interface transferItem {
    value: string
    desc: string
    disabled: boolean
}
export default defineComponent({
    name: 'ClaimQuery',
    setup() {
        const centerDialogVisible = ref(false)
        const claimlevel = [
            {
                value: 'LARGE',
                label: 'LARGE'
            },
            {
                value: 'NIL',
                label: 'NIL'
            },
            {
                value: 'ATTR',
                label: 'ATTR'
            }
        ]
        const claimStatus = [
            {
                value: 'A',
                label: 'Active'
            },
            {
                value: 'C',
                label: 'Close'
            },
            {
                value: 'I',
                label: 'Inactive'
            },
            {
                value: 'R',
                label: 'Reopen'
            },
            {
                value: 'X',
                label: 'CloseAfterReopen'
            }
        ]
        const shortcuts = [
            {
                text: '上周',
                value: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    return [start, end]
                }
            },
            {
                text: '上月',
                value: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    return [start, end]
                }
            },
            {
                text: '前三月',
                value: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                    return [start, end]
                }
            }
        ]
        const currentPage = ref(1)
        const pageSize = ref(10)
        const totalPage = ref(0)
        const lob = ref<ListItem[]>([])
        const handler = ref<ListItem[]>([])
        const expandMore = ref(false)
        const queryForm = ref({
            claimno: '',
            pcyno: '',
            apctnm: '',
            isrdnm: '',
            clmstatus: [],
            branch: '',
            ria_dir: '',
            clm_hdlr: [],
            line: [],
            rfl: '',
            claimFlag: [],
            location: '',
            broker: '',
            accidentdate: [],
            cat: '',
            adjuster: '',
            solicitor: '',
            claimcategory: [],
            ria_branch: '',
            registerdate: [],
            reportdate: [],
            closedate: [],
            reopendate: []
        })
        const queryFormRef = ref<InstanceType<typeof ElForm>>()
        const tableData = ref([])
        const columndata = ref<transferItem[]>([])
        const queryColumn = ref<string[]>([])
        const screenWidth = ref('50%')
        const onSubmit = async(queryForm: IQueryForm) => {
            const form = unref(queryForm)
            if (!form) return
            const res = await getClaimInfo(form, currentPage.value, pageSize.value)
            tableData.value = res.data.obj.records
            totalPage.value = res.data.obj.total
            pageSize.value = res.data.obj.pageSize
            currentPage.value = res.data.obj.currentPage
        }
        const handleSizeChange = async(val: number) => {
            const form = unref(queryForm)
            const res = await getClaimInfo(form, currentPage.value, val)
            tableData.value = res.data.obj.records
            totalPage.value = res.data.obj.total
            pageSize.value = res.data.obj.pageSize
            currentPage.value = res.data.obj.currentPage
            // console.log(`${val} items per page`)
        }
        const handleCurrentChange = async(val: number) => {
            const form = unref(queryForm)
            const res = await getClaimInfo(form, val, pageSize.value)
            tableData.value = res.data.obj.records
            totalPage.value = res.data.obj.total
            pageSize.value = res.data.obj.pageSize
            currentPage.value = res.data.obj.currentPage
            // console.log(`current page: ${val}`)
        }
        const initial = async() => {
            let columnList: Array<ITableColumn> = []
            const res = await getTableColumn('ClaimEnquery')
            columnList = res.data.obj
            columnList.forEach((v: any) => {
                columndata.value.push({
                    value: v.columnName,
                    desc: v.columnDesc,
                    disabled: false
                })
                if (v.checkFlag === '1') {
                    queryColumn.value.push(v.columnName)
                }
            })
            const res_lob = await getLob()
            const lobList: Array<IDictionary> = res_lob.data.obj
            lobList.forEach((v: IDictionary) => {
                lob.value.push({
                    value: v.keyValue,
                    label: v.keyDesc
                })
            })
            const res_handler = await getHandler()
            const handlerList: Array<IDictionary> = res_handler.data.obj
            handlerList.forEach((v: IDictionary) => {
                handler.value.push({
                    value: v.keyValue,
                    label: v.keyDesc
                })
            })
        }
        const exportReportColumn = (queryCondition: IClaimQueryCondtion) => {
            exportClaimReport(queryCondition)
            centerDialogVisible.value = false
        }
        onMounted(initial)
        const FormateAmount = (row: any, column: any, cellValue: any) => {
            return format(cellValue)
        }
        const FormateClaimStatus = (row: any, column: any, cellValue: any) => {
            const s = claimStatus.find((v) => cellValue.trim() === v.value)
            return s?.label
        }
        const FormateReInsure = (row: any, column: any, cellValue: any) => {
            if (cellValue.trim() === 'D') return '直保'
            if (cellValue.trim() === 'R') return '再保'
        }
        watchEffect(() => {
            if (document.body.clientWidth < 1280) {
                screenWidth.value = '90%'
            } else {
                screenWidth.value = '50%'
            }
        })
        const downLoadClaimExcelTemplate = () => {
            alert('1111')
        }
        const centerDialogExcelVisible = ref(false)
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
        const iconSize = 100
        return {
            iconSize,
            mUpload,
            ElNotification,
            centerDialogExcelVisible,
            centerDialogVisible,
            downLoadClaimExcelTemplate,
            screenWidth,
            FormateReInsure,
            FormateClaimStatus,
            FormateAmount,
            handleSizeChange,
            handleCurrentChange,
            currentPage,
            totalPage,
            pageSize,
            columndata,
            queryColumn,
            exportReportColumn,
            tableData,
            queryFormRef,
            expandMore,
            resetFields,
            onSubmit,
            shortcuts,
            queryForm,
            claimStatus,
            claimlevel,
            lob,
            handler
        }
    }
})
</script>

<style>
.el-form-item {
    margin-right: 0 !important;
}
.el-form-item__label {
    width: 100px;
    position: center;
}
.el-form-item__content {
    width: 100%;
    padding-left: 0px;
}
.el-form-item .el-input__inner {
    width: 260px !important;
}
.m_el_transfer .el-transfer-panel {
    width: 300px;
    align-content: center;
}
.m_el_transfer .el-dialog .el-dialog__body {
    display: flex ;
    justify-content: center !important;
    align-items: center ;
}
.m-upload .el-upload {
    width: 100% !important;
}
.m-upload .el-upload .el-upload-dragger {
    width: 100% !important;
}
.m-upload .el-upload__tip {
    font-weight: 700;
    color: red;
}
/* .el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
} */
</style>
