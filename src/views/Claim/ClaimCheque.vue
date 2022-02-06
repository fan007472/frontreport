/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
    <div style='text-align: center'>
        <el-form :model='queryForm'>
            <el-form-item label='1' prop='claimno'>
                <el-input v-model='queryForm.claimno'></el-input>
            </el-form-item>
            <el-form-item label='2' prop='pcyno'>
                <el-input v-model='queryForm.pcyno'></el-input>
            </el-form-item>
            <el-form-item label='3' prop='apctnm'>
                <el-input v-model='queryForm.apctnm'></el-input>
            </el-form-item>
            <el-form-item label='出单公司' prop='branch'>
                <el-select v-model='queryForm.branch' clearable placeholder='请选择'>
                    <el-option value='ZBJ' label='北京分公司'/>
                    <el-option value='ZSH' label='上海分公司'/>
                    <el-option value='ZGD' label='广州分公司'/>
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
                />
            </el-form-item>
            <el-button @click='exportReportColumn({queryColumn,queryForm})'>Test</el-button>
        </el-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { IClaimQueryCondtion, exportClaimReport } from '@/api/components/index'
export default defineComponent({
    name: 'ClaimCheque',
    setup() {
        const queryColumn = ref<string[]>([
            'ADJUSTEND',
            'ADJUSTER',
            'ADJUSTSTART',
            'AGGREMENTDATE',
            'APCTID',
            'APCTNAME',
            'BRANCHCODECLAIM',
            'BRANCHCODEPOLICY',
            'BSCTYPCD',
            'BUSI_DTTM',
            'BUSI_TYPE',
            'CASECATEGORY',
            'CATCODE',
            'CHANNELCODE',
            'CLAIMAPPLICATIONPERSON',
            'CLAIMAPPLYDATE',
            'CLAIMAPPROVEDATE',
            'CLAIMCIRCSTATUS',
            'CLAIMCONCLUSION',
            'CLAIMFIRSTAMOUNTINDEMNITY'
        ])
        const value2 = ref([])
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
            },
            {
                value: 'Option4',
                label: 'Option4'
            },
            {
                value: 'Option5',
                label: 'Option5'
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
        const exportReportColumn = (reportColumn:IClaimQueryCondtion) => {
            console.log(reportColumn.queryForm.claimno)
            console.log(reportColumn.queryForm.registerdate)
            exportClaimReport(reportColumn)
        }
        return {
            queryColumn,
            value2,
            options,
            queryForm,
            exportReportColumn
            // leftValue,
        }
    }
})
</script>

<style lang='postcss' scoped>
.errPage-container {
    padding-top: 100px;
    width: 800px;
    .pan-back-btn {
        background: #008489;
        color: #fff;
        border: none !important;
    }
    .pan-gif {
        margin: 0 auto;
        display: block;
    }
    .pan-img {
        display: block;
        margin: 0 auto;
        width: 100%;
    }
    .text-jumbo {
        font-size: 60px;
        font-weight: 700;
        color: #484848;
    }
    .list-unstyled {
        font-size: 14px;
        li {
            padding-bottom: 5px;
        }
        a {
            color: #008489;
            text-decoration: none;
            &:hover {
                text-decoration: underline;
            }
        }
    }
    .bullshit__return-home {
        display: block;
        float: left;
        width: 110px;
        height: 36px;
        background: var(--color-primary);
        border-radius: 50px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
    }
    img {
        filter: brightness(95%);
    }
}
</style>
