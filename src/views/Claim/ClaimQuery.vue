<<<<<<< HEAD
<template>
    <div>
        12312312
        <!-- <el-form>
            <el-form-item label='Claim No'>
                <el-input v-model='form.ClaimNo'></el-input>
            </el-form-item>
        </el-form> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// const queryForm = {
//     claimno: '',
//     pcyno: '',
//     apctnm: '',
//     isrdnm: '',
//     clmstatus: [],
//     branch: '',
//     ria_dir: '',
//     clm_hdlr: [],
//     line: [],
//     rfl: '',
//     claimFlag: '',
//     location: '',
//     broker: '',
//     lssfrom: '',
//     lssto: '',
//     cat: '',
//     adjuster: '',
//     solicitor: '',
//     claimcategory: [],
//     ria_branch: '',
//     rgtnfrom: '',
//     rprtfrom: '',
//     clsefrom: '',
//     reopenfrom: '',
//     rgtnto: '',
//     rprtto: '',
//     clseto: '',
//     reopento: ''
// }
export default defineComponent({
    name: 'ClaimQuery',
    setup() {
        return {
            // queryForm
        }
    }
})
</script>
=======
<template>
    <div class='content'>
        <el-row :gutter='15' class='clear-both'>
            <el-col :span='24'>
                <card-list title='表单' type='keyvalue' :show-header='true'>
                    <template #btn>
                        <el-button-group>
                            <el-button icon='el-icon-edit' size='mini' @click='submit'>
                                提交
                            </el-button>
                            <el-button size='mini' icon='el-icon-edit' @click='resetFields(refForm)'>
                                重置11
                            </el-button>
                        </el-button-group>
                    </template>
                    <template #keyvalue>
                        <el-form ref='refForm' class='card-list-form' :model='form' :rules='rules' size='mini'>
                            <el-row :gutter='15'>
                                <card-list-item width='100px' :is-require='true' prop='name'>
                                    <template #key>
                                        赔案号
                                    </template>
                                    <template #value>
                                        <el-input v-model='form.name' placeholder='请输入姓名' />
                                    </template>
                                </card-list-item>
                                <card-list-item width='100px' :is-require='true' prop='region'>
                                    <template #key>
                                        活动区域
                                    </template>
                                    <template #value>
                                        <el-select v-model='form.region' placeholder='请选择活动区域'>
                                            <el-option label='区域一' value='shanghai' />
                                            <el-option label='区域二' value='beijing' />
                                        </el-select>
                                    </template>
                                </card-list-item>
                                <card-list-item width='100px' prop='delivery'>
                                    <template #key>
                                        即时配送
                                    </template>
                                    <template #value>
                                        <el-switch v-model='form.delivery' />
                                    </template>
                                </card-list-item>
                                <card-list-item width='100px' :is-require='true' prop='type'>
                                    <template #key>
                                        活动性质
                                    </template>
                                    <template #value>
                                        <el-checkbox-group v-model='form.type'>
                                            <el-checkbox label='美食' name='type' />
                                            <el-checkbox label='地推' name='type' />
                                            <el-checkbox label='线下' name='type' />
                                            <el-checkbox label='品牌' name='type' />
                                        </el-checkbox-group>
                                    </template>
                                </card-list-item>
                                <el-date-picker
                                    v-model='value7'
                                    unlink-panels
                                    type='daterange'
                                    range-separator='-'
                                    start-placeholder='开始日期'
                                    end-placeholder='结束日期'>
                                </el-date-picker>
                            </el-row>
                        </el-form>
                    </template>
                </card-list>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import CardList from '@/components/CardList/CardList.vue'
import CardListItem from '@/components/CardList/CardListItem.vue'
import { validate, resetFields } from '@/utils/formExtend'

const keyValue = () => {
    const form = reactive({
        name: '',
        region: '',
        delivery: false,
        resource: '',
        type: []
    })
    const rules = reactive({
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        region: [{ required: true, message: '请选择活动区域', trigger: 'blur' }],
        resource: [{ required: true, message: '请选择活动性质', trigger: 'blur' }],
        type: [{ required: true, message: '请选择特殊资源', trigger: 'blur' }]
    })
    const refForm = ref(null)
    const submit = async() => {
        if (!(await validate(refForm))) return
        console.log(form)
    }
    return {
        form,
        rules,
        submit,
        refForm,
        resetFields
    }
}
export default defineComponent({
    data() {
        return {
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            value6: '',
            value7: ''
        }
    },
    components: {
        CardList,
        CardListItem
    },
    setup() {
        return {
            ...keyValue()
        }
    }
})
</script>
>>>>>>> frontreport/master
