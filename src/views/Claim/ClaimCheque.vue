/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
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
        }
    }
})
</script>

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
}
</style>
