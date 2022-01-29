<template>
    <div>
        <el-card class='box-card'>
            <el-form :inline='true' :model='queryForm' ref='queryFormRef'>
                <el-form-item label='被保险人' prop='isrdnm'>
                    <el-input v-model='queryForm.isrdnm'></el-input>
                </el-form-item>
                <el-form-item label='案件状态' prop='clmstatus'>
                    <el-select v-model='queryForm.clmstatus' clearable placeholder='请选择'>
                        <el-option
                            v-for='item in options'
                            :key='item.value'
                            :label='item.label'
                            :value='item.value'
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='再保标识' prop='branch'>
                    <el-select v-model='queryForm.branch' clearable placeholder='请选择'>
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
                <el-form-item label='产品线' prop='line'>
                    <el-select v-model='queryForm.line' multiple clearable placeholder='请选择'>
                        <el-option
                            v-for='item in options'
                            :key='item.value'
                            :label='item.label'
                            :value='item.value'
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='RC/NRC' prop='rfl'>
                    <el-select v-model='queryForm.rfl' clearable placeholder='请选择'>
                        <el-option value='RC' label='RC'/>
                        <el-option value='NRC' label='Non RC'/>
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
                        :shortcuts='shortcuts'
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
                        :shortcuts='shortcuts'
                    />
                </el-form-item>
                <br>
                <transition name='slide-fade'>
                    <div v-if='expandMore'>
                        <el-form-item label='赔案号' prop='claimno'>
                            <el-input v-model='queryForm.claimno' clearable></el-input>
                        </el-form-item>
                        <el-form-item label='保单号' prop='pcyno'>
                            <el-input v-model='queryForm.pcyno'></el-input>
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
                    </div>
                </transition>
                <el-form-item>
                    <el-button type='primary' @click='onSubmit()' style='margin-left: 1em;' icon='el-icon-search'>查询</el-button>
                    <el-button type='warning' @click='resetFields(queryFormRef)' icon='el-icon-refresh'>清除</el-button>
                    <el-button :icon='expandMore ?&apos;el-icon-arrow-up&apos;:&apos;el-icon-arrow-down&apos;' type='text' @click='expandMore =!expandMore'>{{ expandMore ? '更多查询条件：收起':'更多查询条件：展开' }}</el-button>
                    <el-button type='success' icon='el-icon-download'>报表导出</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
    <!-- <div>
        <el-table :data='tableData' stripe style='width: 100%'>
            <el-table-column prop='date' label='Date' width='180' />
            <el-table-column prop='name' label='Name' width='180' />
            <el-table-column prop='address' label='Address' />
        </el-table>
    </div> -->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { ElForm } from 'element-plus'
import { resetFields } from '@/utils/formExtend'
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
    claimFlag: '',
    location: '',
    broker: '',
    accidentdate: '',
    cat: '',
    adjuster: '',
    solicitor: '',
    claimcategory: [],
    ria_branch: '',
    registerdate: '',
    reportdate: '',
    closedate: '',
    reopendate: ''
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
export default defineComponent({
    name: 'ClaimQuery',
    setup() {
        const onSubmit = () => {
            console.log('submit!')
        }
        return {
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
.el-input__inner {
  width: 260px !important;
}
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
