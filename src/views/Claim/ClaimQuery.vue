<template>
    <div>
        <el-form :inline='true' :model='queryForm' ref='queryFormRef'>
            <el-form-item label='被保险人' prop='isrdnm'>
                <el-input v-model='queryForm.isrdnm' clearable></el-input>
            </el-form-item>
            <el-form-item label='案件状态' prop='clmstatus'>
                <el-select v-model='queryForm.clmstatus' multiple clearable placeholder='请选择'>
                    <el-option
                        v-for='item in options'
                        :key='item.value'
                        :label='item.label'
                        :value='item.value'
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='再保标识' prop='ria_dir'>
                <el-select v-model='queryForm.ria_dir' clearable placeholder='请选择'>
                    <el-option value='D' label='直保'/>
                    <el-option value='R' label='再保'/>
                </el-select>
            </el-form-item>
            <el-form-item label='理赔员' prop='clm_hdlr'>
                <el-select v-model='queryForm.clm_hdlr' multiple clearable placeholder='请选择'>
                    <el-option
                        v-for='item in options'
                        :key='item.value'
                        :label='item.label'
                        :value='item.value'
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <template v-if='expandMore'>
                <el-form-item label='保单号' prop='pcyno'>
                    <el-input v-model='queryForm.pcyno' clearable></el-input>
                </el-form-item>
                <el-form-item label='投保人' prop='apctnm'>
                    <el-input v-model='queryForm.apctnm'></el-input>
                </el-form-item>
                <el-form-item label='准备金标识' prop='claimFlag'>
                    <el-select v-model='queryForm.claimFlag' multiple placeholder='请选择'>
                        <el-option
                            v-for='item in options'
                            :key='item.value'
                            :label='item.label'
                            :value='item.value'
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='大案分类' prop='claimcategory'>
                    <el-select v-model='queryForm.claimcategory' multiple placeholder='案件分类'>
                        <el-option
                            v-for='item in options'
                            :key='item.value'
                            :label='item.label'
                            :value='item.value'
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='再保公司' prop='ria_branch'>
                    <el-input v-model='queryForm.ria_branch'></el-input>
                </el-form-item>
                <el-form-item label='事故期间' prop='accidentdate'>
                    <el-date-picker
                        v-model='queryForm.accidentdate'
                        type='daterange'
                        unlink-panels
                        range-separator='-'
                        start-placeholder='Start date'
                        end-placeholder='End date'
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
                        :shortcuts='shortcuts'
                    />
                </el-form-item>
                <el-form-item label='出单公司' prop='branch'>
                    <el-select v-model='queryForm.branch' clearable placeholder='请选择'>
                        <el-option value='ZBJ' label='北京分公司'/>
                        <el-option value='ZSH' label='上海分公司'/>
                        <el-option value='ZGD' label='广州分公司'/>
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
                        :shortcuts='shortcuts'
                    >
                    </el-date-picker>
                </el-form-item>
            </template>
            <el-form-item>
                <el-button type='primary' @click='onSubmit()' style='margin-left: 1em;' icon='el-icon-search'>查询</el-button>
                <el-button type='warning' @click='resetFields(queryFormRef)' icon='el-icon-refresh'>清除</el-button>
                <el-button :icon='expandMore ?&apos;el-icon-arrow-up&apos;:&apos;el-icon-arrow-down&apos;' type='text' @click='expandMore =!expandMore'>{{ expandMore ? '更多查询条件：收起':'更多查询条件：展开' }}</el-button>
                <el-button type='success' icon='el-icon-download' @click='centerDialogVisible = true'>报表导出</el-button>
            </el-form-item>
        </el-form>
        <el-table :data='tableData' stripe style='width: 100%'>
            <el-table-column prop='date' label='Date' width='180' />
            <el-table-column prop='name' label='Name' width='180' />
            <el-table-column prop='address' label='Address' />
        </el-table>
        <el-dialog v-model='centerDialogVisible' title='报表字段选择' width='55%' center>
            <div class='m_el_transfer'>
                <el-transfer
                    v-model='queryColumn'
                    filterable
                    :props='{
                        key: &apos;value&apos;,
                        label: &apos;desc&apos;,
                    }'
                    :titles='[&apos;Source&apos;, &apos;Target&apos;]'
                    :format='{
                        noChecked: &apos;${total}&apos;,
                        hasChecked: &apos;${checked}/${total}&apos;,
                    }'
                    :data='columndata'
                >
                </el-transfer>
            </div>
            <template #footer>
                <span class='dialog-footer'>
                    <el-button @click='centerDialogVisible = false'>取消</el-button>
                    <el-button type='primary' @click='exportReportColumn({queryColumn,queryForm})'
                    >导出报表</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { ElForm } from 'element-plus'
import { resetFields } from '@/utils/formExtend'
import { getTableColumn, ITableColumn, exportClaimReport, Option, IClaimQueryCondtion } from '@/api/components/index'

export default defineComponent({
    name: 'ClaimQuery',
    setup() {
        const centerDialogVisible = ref(false)
        const options = [
            {
                value: 'Option1',
                label: 'Option1'
            },
            {
                value: 'Option2',
                label: 'Option2'
            },
            {
                value: 'Option3',
                label: 'Option3'
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
            accidentdate: '',
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
        const tableData = [
            {
                date: '2016-05-03',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles'
            },
            {
                date: '2016-05-02',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles'
            },
            {
                date: '2016-05-04',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles'
            },
            {
                date: '2016-05-01',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles'
            }
        ]
        const columndata = ref<Option[]>([])
        const queryColumn = ref<string[]>([])
        const onSubmit = () => {
            console.log('submit!')
        }
        const generateColumn = async() => {
            let columnList:Array<ITableColumn> = []
            const res = await getTableColumn('ClaimEnquery')
            columnList = res.data.obj
            columnList.forEach((v:any) => {
                columndata.value.push({
                    value: v.columnName,
                    desc: v.columnDesc,
                    disabled: false
                })
                if (v.checkFlag === '1') {
                    queryColumn.value.push(v.columnName)
                }
            })
        }
        const exportReportColumn = (queryCondition:IClaimQueryCondtion) => {
            console.log(queryCondition.queryForm.registerdate)
            exportClaimReport(queryCondition)
            centerDialogVisible.value = false
        }
        // onMounted(generateColumn)
        return {
            columndata,
            queryColumn,
            generateColumn,
            exportReportColumn,
            centerDialogVisible,
            tableData,
            queryFormRef,
            expandMore,
            resetFields,
            onSubmit,
            options,
            shortcuts,
            queryForm
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
.el-select,
.el-form-item .el-input__inner {
  width: 260px !important;
}
.m_el_transfer .el-transfer-panel {
    width: 300px;
    align-content: center;
}
.el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
