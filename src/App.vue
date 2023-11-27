<template>
    <div>
        <div class="right-box">
            <div v-if="isConnect">
                <i class="el-icon-success" style="color: #68c13c"></i>
                <span style="color: #68c13c">连接成功</span>
            </div>
            <div v-else>
                <i class="el-icon-error" style="color: #f36b6b"></i>
                <span style="color: #f36b6b">连接关闭</span>
            </div>
        </div>
        <el-tabs v-model="activeName" class="main-box">
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
            ws: null, //建立的连接
            lockReconnect: false, //是否真正建立连接
            timeout: 10 * 1000, //30秒一次心跳
            timeoutObj: null, //心跳心跳倒计时
            serverTimeoutObj: null, //心跳倒计时
            timeoutnum: null, //断开 重连倒计时
            wsUrl: "ws://localhost:250/socket", //后台websocket连接地址
            msg: [], //信息列表
            inputMsg: "", //输入
            isConnect: false
        }
    },
    mounted() {
        this.load()
    },
    created() {
        this.initWebpack();
    },
    beforeDestroy() {
        // 离开页面后关闭连接
        this.destroySocket();
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
        load() {
            this.getStatus()
            this.getRequest()
            this.getNormal()
            this.getLogByStatus()
            this.getLogByTime()
            this.getLogByNormal()
            this.getLogBySafeType()
        },
        destroySocket() {
            this.ws.close();
            this.ws = null
            // 清除时间
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            clearTimeout(this.timeoutnum);
        },
        // 初始化websocket链接
        initWebpack() {
            this.ws = new WebSocket(this.wsUrl);
            this.ws.onopen = this.onopen;
            this.ws.onmessage = this.onmessage;
            this.ws.onclose = this.onclose;
            this.ws.onerror = this.onerror;
        },
        //重新连接
        reconnect() {
            const that = this;
            if (that.lockReconnect) {
                return;
            }
            that.lockReconnect = true;
            //没连接上会一直重连，设置延迟避免请求过多
            that.timeoutnum && clearTimeout(that.timeoutnum);
            that.timeoutnum = setTimeout(function () {
                that.initWebpack(); //新连接
                that.lockReconnect = false;
            }, 5000);
        },
        //重置心跳
        reset() {
            const that = this;
            clearTimeout(that.timeoutObj); //清除心跳倒计时
            clearTimeout(that.serverTimeoutObj); //清除超时关闭倒计时
            that.start(); //重启心跳
        },
        //开启心跳
        start() {
            const self = this;
            self.timeoutObj && clearTimeout(self.timeoutObj); //心跳倒计时如果有值就清除掉，防止重复
            self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj); //超时关闭倒计时如果有值就清除掉，防止重复
            //然后从新开一个定时器
            self.timeoutObj = setTimeout(function () {
                //这里通过readyState判断链接状态，有四个值，0：正在连接，1：已连接，2：正在断开，3：已经断开或者链接不成功
                if (self.ws.readyState === 1) {
                    //如果连接正常，给后天发送一个值，可以自定义，然后后台返回我们一个信息，我们接收到后会触发onmessage方法回调
                    self.ws.send("ping");
                } else {
                    //如果检测readyState不等于1那也就代表不处在链接状态，那就是不正常的，那就调用重连方法
                    self.reconnect();
                }
                //从新赋值一个超时计时器，这个定时器的作用：当你触发心跳的时候可能会出现一个情况，后台崩了，前台发了个心跳，没有回应，就不会触发onmessage方法
                //所以我们需要在这个心跳发送出去了后，再开一个定时器，用于监控心跳返回的时间，比如10秒，那么10秒内如果后台回我了，触发onmessage方法，自然就会把心跳时间和超时倒计时一起清空掉
                //也就不会触发这个关闭连接，但是如果10秒后还是没有收到回应，那么就会触发关闭连接，而关闭连接方法内又会触发重连方法，循环就走起来了。
                self.serverTimeoutObj = setTimeout(function () {
                    //如果超时了就关闭连接
                    self.ws.close();
                }, self.timeout);
            }, self.timeout);
        },
        //连接成功
        onopen() {
            this.isConnect = true
            console.log("连接成功");
            this.$message({
                message: '连接成功',
                type: 'success'
            });
            if (this.ws.readyState === 1) {
                //如果连接正常，给后天发送一个值，可以自定义，然后后台返回我们一个信息，我们接收到后会触发onmessage方法回调
                this.ws.send("链接成功后先发给后台的信息");
            }
            this.start(); //链接成功后开启心跳
        },
        //接受后台信息回调
        onmessage(e) {
            /**这里写自己的业务逻辑代码**/
            if (e.data !== "pong") {
                this.msg.push(e.data);
                console.log("收到后台信息: " + e.data);
                this.$message({
                    message: e.data,
                    type: 'warning'
                });
                this.load()
                this.reset(); //收到服务器信息，心跳重置
            }
        },
        //关闭连接回调
        onclose(e) {
            console.log("连接关闭");
            this.isConnect = false
            this.$message.error('连接关闭');
            this.reconnect(); //重连
        },
        //连接异常回调
        onerror(e) {
            console.log("出现错误");
            this.reconnect(); //重连
        },
        //发送消息
        sendMessage() {
            this.ws.send(this.inputMsg); //把前台的信息发给后台(可以跟后端商量传什么数据结构，一般不是这样简单的一个字符串，都是json格式的)
            this.inputMsg = "";
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
                    this.normalPieData = []
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
            })
        },
    }
}
</script>

<style>
.main-box {
    width: calc(100% - 20px);
    height: 100%;
    padding: 10px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
}

.right-box {
    padding: 20px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
}
</style>
