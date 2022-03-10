<template>
    <div :style='{height:&apos;100%&apos;, backgroundImage:&apos;url(&apos;+background+&apos;)&apos;}'>
        &nbsp;
        <div class='layout-login' @keyup='enterSubmit'>
            <el-form
                ref='ruleForm'
                label-position='right'
                label-width='80px'
                :model='form'
                :rules='rules'
            >
                <el-form-item label='用户名' prop='name' class='change-label-class'>
                    <el-input v-model='form.name' placeholder='请输入您的Windows开机账号' />
                </el-form-item>
                <el-form-item label='密码' prop='pwd' class='change-label-class'>
                    <el-input v-model='form.pwd' type='password' autocomplete='off' placeholder='同您的Windows开机密码' show-password/>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='onSubmit'> 登录 </el-button>
                    <el-button @click='resetFields(ruleForm)'> 重置 </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { store } from '@/store/index'
import { ElNotification } from 'element-plus'
import { validate, resetFields } from '@/utils/formExtend'
import background from '@/assets/img/background2.jpg'

const formRender = () => {
    const form = reactive({
        name: '',
        pwd: ''
    })
    const ruleForm = ref(null)
    const enterSubmit = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSubmit()
        }
    }
    const onSubmit = async() => {
        const { name, pwd } = form
        if (!(await validate(ruleForm))) return
        await store.dispatch('layout/login', { username: name, password: pwd })
        ElNotification({
            title: '欢迎',
            message: `${name} 欢迎回来`,
            type: 'success'
        })
    }
    const rules = reactive({
        name: [
            {
                validator: (
                    rule: any,
                    value: any,
                    callback: (arg0?: Error | undefined) => void
                ) => {
                    if (!value) {
                        return callback(new Error('用户名不能为空'))
                    }
                    callback()
                },
                trigger: 'blur'
            }
        ],
        pwd: [
            {
                validator: (
                    rule: any,
                    value: any,
                    callback: (arg0?: Error | undefined) => void
                ) => {
                    if (!value) {
                        return callback(new Error('密码不能为空'))
                    }
                    callback()
                },
                trigger: 'blur'
            }
        ]
    })
    return {
        form,
        onSubmit,
        enterSubmit,
        rules,
        resetFields,
        ruleForm,
        background
    }
}
export default defineComponent({
    name: 'Login',
    setup() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            ...formRender()
        }
    }
})
</script>

<style>
.layout-login {
  /* padding-top: 1000px; */
  width: 450px;
  margin: 300px 400px;
}
</style>
<style scoped>
.change-label-class :deep() .el-form-item__label{
    color: black;
    font-weight: bold;
}
</style>
