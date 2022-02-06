<template>
    <div class='demo-date-picker'>
        <div class='block'>
            <span class='demonstration'>Default</span>
            <el-date-picker
                v-model='value1'
                type='daterange'
                range-separator='To'
                start-placeholder='Start date'
                end-placeholder='End date'
            >
            </el-date-picker>
        </div>
        <div class='block'>
            <span class='demonstration'>With quick options</span>
            <el-date-picker
                v-model='value2'
                type='daterange'
                unlink-panels
                range-separator='To'
                start-placeholder='Start date'
                end-placeholder='End date'
                :shortcuts='shortcuts'
            >
            </el-date-picker>
        </div>
        <el-button @click='test'>===========</el-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
    name: 'ClaimCirc',
    setup() {
        const value1 = ref('')
        const value2 = ref('')

        const shortcuts = [
            {
                text: 'Last week',
                value: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    return [start, end]
                }
            },
            {
                text: 'Last month',
                value: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    return [start, end]
                }
            },
            {
                text: 'Last 3 months',
                value: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                    return [start, end]
                }
            }
        ]
        const test = () => {
            console.log(value1.value)
        }
        return {
            value1,
            value2,
            shortcuts,
            test
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
