<template>
    <div id="app">

    </div>
</template>

<script>

import {axiosInstance} from "../network/config";

export default {
    name: 'App',
    mounted() {
        this.query()
    },
    methods: {
        query() {
            axiosInstance.post("/log/getLog")
                .then((res) => {
                    console.log(res)
                })
        },
    }
}
</script>

<style>
</style>
