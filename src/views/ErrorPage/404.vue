<template>
    <div class='wscn-http404-container'>
        <div class='wscn-http404'>
            <div class='pic-404'>
                <img
                    class='pic-404__parent'
                    :src='err404'
                    alt='404'
                >
                <img
                    class='pic-404__child left'
                    :src='errCloud'
                    alt='404'
                >
                <img
                    class='pic-404__child mid'
                    :src='errCloud'
                    alt='404'
                >
                <img
                    class='pic-404__child right'
                    :src='errCloud'
                    alt='404'
                >
            </div>
            <div class='bullshit'>
                <div class='bullshit__oops'>
                    OOPS!
                </div>
                <div class='bullshit__info'>
                    All rights reserved
                    <a
                        style='color: var(--color-primary);'
                        href='https://wallstreetcn.com'
                        target='_blank'
                    >wallstreetcn</a>
                </div>
                <div class='bullshit__headline'>
                    {{ message }}
                </div>
                <div class='bullshit__info'>
                    Please check that the URL you entered is correct, or click the button below to return to the homepage.
                </div>

                <router-link
                    to='/'
                    class='bullshit__return-home'
                >
                    Back to home
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import err404 from '@/assets/img/404.png'
import errCloud from '@/assets/img/404_cloud.png'

export default defineComponent({
    name: '404',
    setup() {
        return {
            err404,
            errCloud,
            message: 'The webmaster said that you can not enter this page...'
        }
    }
})
</script>
