<template>
  <div class="main-box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="请求码统计" name="0">
        <el-select v-model="selectedStatus" multiple placeholder="请选择">
          <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <pie-chart :data="pieData"/>
        <log-table :table-data="statusTableData"/>
      </el-tab-pane>
      <el-tab-pane label="起止时间统计" name="1">
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
        <log-table :table-data="timeTableData"/>
      </el-tab-pane>
      <el-tab-pane label="故障统计" name="2">
        <el-checkbox-group v-model="normalState">
          <el-checkbox label="1" border>正常</el-checkbox>
          <el-checkbox label="-1" border>故障</el-checkbox>
        </el-checkbox-group>
        <pie-chart :data="normalPieData"/>
        <log-table :table-data="normalTableData"/>
      </el-tab-pane>
      <el-tab-pane label="安全统计" name="3">
        <el-checkbox-group v-model="safeType">
          <el-checkbox label="assault_xss" border>XSS攻击</el-checkbox>
          <el-checkbox label="assault_file" border>敏感文件攻击</el-checkbox>
          <el-checkbox label="assault_comm" border>命令执行攻击</el-checkbox>
          <el-checkbox label="assault_sqlinj" border>sql注入攻击</el-checkbox>
          <el-checkbox label="assault_webshell" border>webshell连接攻击</el-checkbox>
        </el-checkbox-group>
        <vertical-bar-chart :data="safeBarData"/>
        <log-table :table-data="safeTableData"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import {axiosInstance} from "../network/config";
import PieChart from "@/components/PieChart.vue";
import HorizontalBarChart from "@/components/HorizontalBarChart.vue";
import LogTable from "@/components/LogTable.vue";
import VerticalBarChart from "@/components/VerticalBarChart.vue";

export default {
  name: 'App',
  components: {VerticalBarChart, LogTable, HorizontalBarChart, PieChart},
  data() {
    return {
      activeName: '0',
      status: [],
      selectedStatus: [],
      tableData: [],
      statusTableData: {
        logs: [],
        limit: 10,
        page: 1,
      },
      timeTableData: {
        logs: [],
        limit: 10,
        page: 1,
      },
      normalTableData: {
        logs: [],
        limit: 10,
        page: 1,
      },
      safeTableData: {
        logs: [],
        limit: 10,
        page: 1,
      },
      pieData: [],
      normalPieData: [],
      barData: [],
      safeBarData: [],
      statusList: [],
      normalList: [],
      time: '',
      normalState: ['1', '-1'],
      safeType: ['assault_xss', 'assault_file', 'assault_comm', 'assault_sqlinj', 'assault_webshell'],
    }
  },
  mounted() {
    this.getStatus()
    this.getRequest()
    this.getNormal()
    this.getLogByStatus()
    this.getLogByTime()
    this.getLogByNormal()
    this.getLogBySafeType()
  },
  watch: {
    selectedStatus() {
      this.statusTableData.page = 1
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
    },
    normalState() {
      this.normalTableData.page = 1
      this.getLogByNormal()
      this.normalPieData = []
      this.normalState.forEach((item) => {
        this.normalList.forEach((item2) => {
          if (item === item2.normal) {
            this.normalPieData.push({
              'value': item2.count,
              'name': item2.normal === '1' ? '正常' : '故障'
            })
          }
        })
      })
    },
    safeType() {
      this.safeTableData.page = 1
      this.getLogBySafeType()
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
    getNormal() {
      axiosInstance.post("/log/getNormal", {})
          .then((res) => {
            this.normalList = []
            this.normalList.push(...res.data)
            res.data.forEach((item) => {
              this.normalPieData.push({
                'value': item.count,
                'name': item.normal === '1' ? '正常' : '故障'
              })
            })
          })
    },
    getRequest() {
      axiosInstance.post("/log/getRequest", {
        startTime: this.time[0],
        endTime: this.time[1]
      }).then((res) => {
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
      }).then((res) => {
        this.statusTableData.logs = []
        this.statusTableData.logs.push(...res.data)
      })
    },
    getLogByTime() {
      axiosInstance.post("/log/getLogByTime", {
        startTime: this.time[0],
        endTime: this.time[1]
      }).then((res) => {
        this.timeTableData.logs = []
        this.timeTableData.logs.push(...res.data)
      })
    },
    getLogByNormal() {
      axiosInstance.post("/log/getLogByNormal", {
        normal: this.normalState,
      }).then((res) => {
        this.normalTableData.logs = []
        this.normalTableData.logs.push(...res.data)
      })
    },
    getLogBySafeType() {
      axiosInstance.post("/log/getLogBySafeType", {
        type: this.safeType,
      }).then((res) => {
        this.safeTableData.logs = []
        this.safeTableData.logs.push(...res.data)
        let xss = 0
        let file = 0
        let comm = 0
        let sql = 0
        let web = 0
        this.safeTableData.logs.forEach((item) => {
          if (item.assault_xss === '1') {
            xss++
          }
          if (item.assault_file === '1') {
            file++
          }
          if (item.assault_comm === '1') {
            comm++
          }
          if (item.assault_sqlinj === '1') {
            sql++
          }
          if (item.assault_webshell === '1') {
            web++
          }
        })
        this.safeBarData = [xss, file, comm, sql, web]
        console.log('xss', xss)
      })
    },
  }
}
</script>

<style>
</style>
