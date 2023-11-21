<template>
    <div id="main-box">
        <el-select v-model="selectedStatus" multiple placeholder="请选择">
            <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
        <pie-chart :data="pieData"/>
        <el-table
                :data="logs.slice((page-1)*limit, page*limit)"
                style="width: 100%">
            <el-table-column
                    prop="remote_addr"
                    label="remote_addr"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="remote_user"
                    label="remote_user"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="time_local"
                    :show-overflow-tooltip="true"
                    label="time_local">
            </el-table-column>
            <el-table-column
                    prop="request"
                    :show-overflow-tooltip="true"
                    label="request">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="status">
            </el-table-column>
            <el-table-column
                    prop="body_bytes_sent"
                    label="body_bytes_sent">
            </el-table-column>
            <el-table-column
                    prop="http_referer"
                    :show-overflow-tooltip="true"
                    label="http_referer">
            </el-table-column>
            <el-table-column
                    prop="http_user_agent"
                    :show-overflow-tooltip="true"
                    label="http_user_agent">
            </el-table-column>
            <el-table-column
                    prop="http_x_forwarded_for"
                    label="http_x_forwarded_for">
            </el-table-column>
        </el-table>
        <el-pagination
                background
                :current-page="page"
                :page-size="limit"
                :pager-count="11"
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="logs.length">
        </el-pagination>
    </div>
</template>

<script>

import {axiosInstance} from "../network/config";
import PieChart from "@/assets/component/PieChart.vue";

export default {
    name: 'App',
    components: {PieChart},
    data() {
        return {
            status: [],
            selectedStatus: [],
            tableData: [],
            logs: [],
            limit: 10,
            page: 1,
            pieData: [],
            statusList: []
        }
    },
    mounted() {
        this.getLogByStatus()
        this.getStatus()
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
        handleCurrentChange(page) {
            this.page = page;
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
        getLogByStatus() {
            axiosInstance.post("/log/getLogByStatus", {
                status: this.selectedStatus
            })
                .then((res) => {
                    this.logs = []
                    this.logs.push(...res.data)
                })
        },
    }
}
</script>

<style>
</style>
