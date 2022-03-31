<template>
    <div>
        <el-button type='text' @click='dialogFormVisible = true'
        >open a Form nested Dialog</el-button
        >
        <el-dialog v-model='dialogFormVisible' title='Shipping address'>
            <el-form :model='form'>
                <el-form-item label='Promotion name' :label-width='formLabelWidth'>
                    <el-input v-model='form.name' autocomplete='off' />
                </el-form-item>
                <el-form-item label='Zones' :label-width='formLabelWidth'>
                    <el-select v-model='form.region' placeholder='Please select a zone'>
                        <el-option label='Zone No.1' value='shanghai' />
                        <el-option label='Zone No.2' value='beijing' />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class='dialog-footer'>
                    <el-button @click='dialogFormVisible = false'>Cancel</el-button>
                    <el-button type='primary' @click='dialogFormVisible = false'
                    >Confirm</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script lang='ts'>
import { defineComponent, ref, reactive } from 'vue'
export default defineComponent({
    name: 'GeneralQuery',
    setup() {
        const centerDialogVisible = ref(false)
        const dialogVisible = ref(false)
        const dialogTableVisible = ref(false)
        const dialogFormVisible = ref(false)
        const formLabelWidth = '140px'
        const form = reactive({
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
        })
        return { centerDialogVisible, dialogVisible, form, dialogTableVisible, dialogFormVisible, formLabelWidth }
    }
})
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
