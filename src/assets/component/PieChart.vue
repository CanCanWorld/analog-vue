<template>
    <div>
        <div id="main" style="width: 600px; height: 400px"></div>
    </div>
</template>

<script>
export default {
    name: "PieChart",
    props: ["data"],
    data() {
        return {
            myChart: null,
            options: ""
        }
    },
    mounted() {
        // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
        this.myChart = this.$echarts.init(document.getElementById("main"));
        this.drawChart();
    },
    watch: {
        data() {
            this.options = {
                title: {
                    text: '状态码统计',
                    subtext: 'Analog',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: '状态码统计',
                        type: 'pie',
                        radius: '50%',
                        data: this.data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        },
        options() {
            this.myChart.clear()
            this.myChart.setOption(this.options);
        }
    },
    methods: {
        drawChart() {
            // 使用刚指定的配置项和数据显示图表。
            this.myChart.setOption(this.options);
        },

    },
}
</script>

<style scoped>

</style>
