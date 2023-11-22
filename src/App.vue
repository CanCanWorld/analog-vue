<template>
    <div id="main-box">
        请求码：
        <el-select v-model="selectedStatus" multiple placeholder="请选择">
            <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
        <pie-chart :data="pieData"/>
        <el-collapse accordion>
            <el-collapse-item title="详情">
                <log-table :logs="logsStatus" :page="pageStatus" :limit="limitStatus"/>
            </el-collapse-item>
        </el-collapse>
        请求时间：
        <el-date-picker
                v-model="time"
                type="daterange"
                align="right"
                value-format="yyyy-MM-dd HH:mm:ss"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange">
        </el-date-picker>
        <horizontal-bar-chart :data="barData"/>
        <el-collapse accordion>
            <el-collapse-item title="详情">
                <log-table :logs="logsTime" :page="pageTime" :limit="limitTime"/>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>

import {axiosInstance} from "../network/config";
import PieChart from "@/assets/component/PieChart.vue";
import HorizontalBarChart from "@/assets/component/HorizontalBarChart.vue";
import LogTable from "@/assets/component/LogTable.vue";

export default {
    name: 'App',
    components: {LogTable, HorizontalBarChart, PieChart},
    data() {
        return {
            status: [],
            selectedStatus: [],
            tableData: [],
            logsStatus: [],
            limitStatus: 10,
            pageStatus: 1,
            logsTime: [],
            limitTime: 10,
            pageTime: 1,
            pieData: [],
            barData: [],
            statusList: [],
            time: '',
        }
    },
    mounted() {
        this.getStatus()
        this.getRequest()
        this.getLogByStatus()
        this.getLogByTime()
    },
    watch: {
        selectedStatus() {
            this.page = 1
            console.log(this.selectedStatus)
            this.getLogByStatus()
            this.pieData = []
            this.selectedStatus.forEach((item) => {
                this.statusList.forEach((item2) => {
                    if (item === item2.status) {
                        this.pieData.push({
                            'value': item2.count,
                            'name': item
                        })
                    }
                })
            })
        }
    },
    methods: {
        timeChange() {
            this.getLogByTime()
            this.getRequest()
        },
        getStatus() {
            axiosInstance.post("/log/getStatus", {})
                .then((res) => {
                    console.log(res)
                    this.statusList = []
                    this.statusList.push(...res.data)
                    this.selectedStatus = []
                    res.data.forEach((item) => {
                        this.status.push({
                            value: item.status,
                            label: item.status
                        })
                        this.selectedStatus.push(item.status)
                    })
                })
        },
        getRequest() {
            axiosInstance.post("/log/getRequest", {
                startTime: this.time[0],
                endTime: this.time[1]
            })
                .then((res) => {
                    console.log(res)
                    this.barData = []
                    let request = []
                    let count = []
                    res.data.slice(0, 10).forEach((item) => {
                        request.push(item.request)
                        count.push(item.count)
                    })
                    this.barData = {
                        yAxis: request.reverse(),
                        series: count.reverse()
                    }
                })
        },
        getLogByStatus() {
            axiosInstance.post("/log/getLogByStatus", {
                status: this.selectedStatus,
            })
                .then((res) => {
                    this.logsStatus = []
                    this.logsStatus.push(...res.data)
                })
        },
        getLogByTime() {
            axiosInstance.post("/log/getLogByTime", {
                startTime: this.time[0],
                endTime: this.time[1]
            })
                .then((res) => {
                    this.logsTime = []
                    this.logsTime.push(...res.data)
                })
        },
    }
}
</script>

<style>
</style>
