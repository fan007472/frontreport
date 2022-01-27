<template>
    <div>
        <el-form :inline='true'>
            <el-form-item label='理赔号'>
                <el-input v-model='queryForm.claimno' clearable></el-input>
            </el-form-item>
            <el-form-item label='保单号'>
                <el-input v-model='queryForm.pcyno'></el-input>
            </el-form-item>
            <el-form-item label='投保人'>
                <el-input v-model='queryForm.apctnm'></el-input>
            </el-form-item>
            <el-form-item label='被保险人'>
                <el-input v-model='queryForm.isrdnm'></el-input>
            </el-form-item>
            <el-form-item label='案件状态'>
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
            <el-form-item label='公司名称'>
                <el-select v-model='queryForm.branch' clearable placeholder='理赔机构'>
                    <el-option value='ZBJ' label='北京分公司'/>
                    <el-option value='ZSH' label='上海分公司'/>
                    <el-option value='ZGD' label='广州分公司'/>
                </el-select>
            </el-form-item>
            <el-form-item label='再保标识'>
                <el-select v-model='queryForm.branch' clearable placeholder='直保/再保标识'>
                    <el-option value='D' label='直保'/>
                    <el-option value='R' label='再保'/>
                </el-select>
            </el-form-item>
            <el-form-item label='理赔经办人'>
                <el-select v-model='queryForm.clm_hdlr' multiple clearable placeholder='赔案处理人员'>
                    <el-option
                        v-for='item in options'
                        :key='item.value'
                        :label='item.label'
                        :value='item.value'
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='产品线'>
                <el-select v-model='queryForm.line' multiple clearable placeholder='Select'>
                    <el-option
                        v-for='item in options'
                        :key='item.value'
                        :label='item.label'
                        :value='item.value'
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='RC/NRC'>
                <el-select v-model='queryForm.rfl' clearable placeholder='是否RC保单'>
                    <el-option value='RC' label='RC'/>
                    <el-option value='NRC' label='Non RC'/>
                </el-select>
            </el-form-item>
            <el-form-item label='准备金标识'>
                <el-select v-model='queryForm.claimFlag' multiple placeholder='Select'>
                    <el-option
                        v-for='item in options'
                        :key='item.value'
                        :label='item.label'
                        :value='item.value'
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='事故地'>
                <el-input v-model='queryForm.location'></el-input>
            </el-form-item>
            <el-form-item label='经纪人&公司'>
                <el-input v-model='queryForm.cat'></el-input>
            </el-form-item>
            <el-form-item label='委派公估'>
                <el-input v-model='queryForm.adjuster'></el-input>
            </el-form-item>
            <el-form-item label='委派律师'>
                <el-input v-model='queryForm.solicitor'></el-input>
            </el-form-item>
            <el-form-item label='大案分类'>
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
            <el-form-item label='再保公司'>
                <el-input v-model='queryForm.ria_branch'></el-input>
            </el-form-item>
            <el-form-item label='事故期间'>
                <el-date-picker
                    v-model='accidentdate'
                    type='daterange'
                    unlink-panels
                    range-separator='-'
                    start-placeholder='Start date'
                    end-placeholder='End date'
                    :shortcuts='shortcuts'
                />
            </el-form-item>
            <el-form-item label='报案期间'>
                <el-date-picker
                    v-model='reportdate'
                    type='daterange'
                    unlink-panels
                    range-separator='-'
                    start-placeholder='Start date'
                    end-placeholder='End date'
                    :shortcuts='shortcuts'
                />
            </el-form-item>
            <el-form-item label='立案期间'>
                <el-date-picker
                    v-model='registerdate'
                    type='daterange'
                    unlink-panels
                    range-separator='-'
                    start-placeholder='Start date'
                    end-placeholder='End date'
                    :shortcuts='shortcuts'
                />
            </el-form-item>
            <el-form-item label='关案期间'>
                <el-date-picker
                    v-model='closedate'
                    type='daterange'
                    unlink-panels
                    range-separator='-'
                    start-placeholder='Start date'
                    end-placeholder='End date'
                    :shortcuts='shortcuts'
                />
            </el-form-item>
            <el-form-item label='重开期间'>
                <el-date-picker
                    v-model='reopendate'
                    type='daterange'
                    unlink-panels
                    range-separator='-'
                    start-placeholder='Start date'
                    end-placeholder='End date'
                    :shortcuts='shortcuts'
                >
                </el-date-picker>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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
export default defineComponent({
    name: 'ClaimQuery',
    setup() {
        return {
            options,
            shortcuts,
            queryForm
        }
    }
})
</script>
