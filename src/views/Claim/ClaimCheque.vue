/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
<<<<<<< HEAD
    <div style='text-align: center'>
        <el-form :model='queryForm' :inline='true' ref='queryFormRef'>
            <el-form-item label='股票名称' prop='stock_name'>
                <el-input v-model='queryForm.stock_name'></el-input>
            </el-form-item>
            <el-form-item label='股票代码' prop='ts_code'>
                <el-input v-model='queryForm.ts_code'></el-input>
            </el-form-item>
            <el-form-item label='行业' prop='industy'>
                <el-input v-model='queryForm.industy'></el-input>
            </el-form-item>
            <el-form-item label='市场' prop='market'>
                <el-input v-model='queryForm.market'></el-input>
            </el-form-item>
            <el-button type='primary' @click='queryStockBasicInfo(queryForm)'>查询</el-button>
            <el-button type='warning' @click='resetFields(queryFormRef)' icon='el-icon-refresh'>清除</el-button>
=======
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
>>>>>>> a794e69299ade160930829631b2f147fc426adf3
        </el-form>
        <el-table :data='tableData' stripe style='width: 100%'>
            <el-table-column prop='tsCode' label='代码' width='180' />
            <el-table-column prop='name' label='名称' width='180' />
            <el-table-column prop='industry' label='行业' />
        </el-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
<<<<<<< HEAD
import { resetFields } from '@/utils/formExtend'
import type { ElForm } from 'element-plus'
import type { IStockBasicList } from '@/type/TableSearchTest'
import { getStockBasicInfo } from '@/api/components/index'
export default defineComponent({
    name: 'ClaimCheque',
    setup() {
        const queryForm = ref({
            stock_name: '',
            ts_code: '',
            industy: '',
            market: ''
        })
        const tableData = ref<IStockBasicList[]>([])
        const queryFormRef = ref<InstanceType<typeof ElForm>>()
        const queryStockBasicInfo = async() => {
            const res = await getStockBasicInfo(queryForm.value)
            tableData.value = res.data.obj
        }
        return {
            queryForm,
            resetFields,
            queryFormRef,
            tableData,
            queryStockBasicInfo
=======
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
>>>>>>> a794e69299ade160930829631b2f147fc426adf3
        }
    }
})
</script>

<<<<<<< HEAD
<style lang="postcss" scoped>
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
=======
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
>>>>>>> a794e69299ade160930829631b2f147fc426adf3
}
</style>
