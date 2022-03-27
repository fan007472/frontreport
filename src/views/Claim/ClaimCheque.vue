/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
    <div style='margin-left:10px'>
        <el-form :model='queryForm' ref='queryFormRef'>
            <el-row>
                <el-col>
                    <el-form-item label='出单公司' prop='company'>
                        <el-select v-model='queryForm.company' clearable placeholder='请选择'>
                            <el-option value='ZBJ' label='北京分公司' />
                            <el-option value='ZSH' label='上海分公司' />
                            <el-option value='ZGD' label='广州分公司' />
                        </el-select>
                    </el-form-item>
                </el-col></el-row>
            <el-row><el-col :span='12'>
                <el-form-item label='赔案号' prop='claim_no'>
                    <el-input v-model='queryForm.claim_no' type='textarea' clearable placeholder='请输入案件号，多个案件以英文半角分号[,]隔开' class='w-20' />
                </el-form-item></el-col>
            </el-row>
            <el-row :gutter= '20'>
                <el-col :lg='12' :xl='7'>
                    <el-card class='box-card'>
                        <template #header>
                            <div class='card-header'>
                                <span class='item_title'>Payment Report</span>
                                <!-- <el-button type='text' @click='downloadPaymentReport(queryForm)'><i class='el-icon-download'>Report download</i></el-button> -->
                                <el-button type='text' @click='dialogFormVisible = true'><i class='el-icon-download'>Report download</i></el-button>
                            </div>
                        </template>
                        <el-form-item label='ApproveDate' prop='approve_date'>
                            <el-date-picker
                                v-model='queryForm.approve_date'
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
                        <el-form-item label='Cat Code' prop='cat_no'>
                            <el-input v-model='queryForm.cat_no' clearable></el-input>
                        </el-form-item>
                    </el-card>
                </el-col>
                <el-col :lg='12' :xl='7'>
                    <el-card class='box-card'>
                        <template #header>
                            <div class='card-header'>
                                <span class='item_title'>Recovery Report</span>
                                <el-button type='text' @click='downloadChequeReport(queryForm)'><i class='el-icon-download'>Report download</i></el-button>
                            </div>
                        </template>
                        <el-form-item label='RecoveryDate' prop='recovery_date'>
                            <el-date-picker
                                v-model='queryForm.recovery_date'
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
                    </el-card>
                </el-col>
            </el-row>
            <el-dialog v-model='dialogFormVisible' title='报表选择' width='30%'>
                <el-radio-group v-model='queryForm.report_name'>
                    <el-radio label='total' border>Claims Cheque Report</el-radio>
                    <el-radio label='detail' border>Claims Cheque Report – NOL</el-radio>
                </el-radio-group>
                <template #footer>
                    <span class='dialog-footer'>
                        <el-button @click='dialogFormVisible = false'>Cancel</el-button>
                        <el-button type='primary' @click='downloadPaymentReport(queryForm)'
                        >Confirm</el-button
                        >
                    </span>
                </template>
            </el-dialog>
        </el-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { exportClaimPaymentReport, exportClaimChequeReport } from '@/api/components/index'
export default defineComponent({
    name: 'ClaimCheque',
    setup() {
        const dialogFormVisible = ref(false)
        const radio = ref('total')
        const queryForm = ref({
            claim_no: '',
            company: '',
            cat_no: '',
            approve_date: [],
            recovery_date: [],
            report_name: ''
        })
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
        async function downloadPaymentReport(queryForm:any) {
            dialogFormVisible.value = false
            exportClaimPaymentReport(queryForm)
        }
        async function downloadChequeReport(queryForm:any) {
            exportClaimChequeReport(queryForm)
        }
        return {
            queryForm,
            shortcuts,
            radio,
            dialogFormVisible,
            downloadPaymentReport,
            downloadChequeReport
        }
    }
})
</script>

<style lang='postcss' scoped>
.item_title {
    font-size: 120%;
    color: blue;
    font-style: italic;
    font-weight: bold;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-card {
    height:280px;
    margin-top: 10px;
}
</style>
