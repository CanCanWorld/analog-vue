<template>
  <div>
    <div ref="echart" class="echart"></div>
  </div>
</template>

<script>
export default {
  name: "HorizontalBarChart",
  props: ["data"],
  data() {
    return {
      myChart: null,
      options: ""
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
    this.myChart = this.$echarts.init(this.$refs.echart);
    this.drawChart();
  },
  watch: {
    data() {
      this.options = {
        title: {
          text: '请求数统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          splitLine: {
            show: false
          },
        },
        yAxis: {
          type: 'category',
          data: this.data.yAxis,
          axisLabel: {
            margin: -2,
            interval: 0,
            color: ['#000000'],
            align: 'left',
            verticalAlign: 'bottom',
            lineHeight: 30,
            fontSize: 13,
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          z: 99
        },
        series: [{
          name: '请求数',
          type: 'bar',
          barWidth: 20,
          data: this.data.series,
          showBackground: true,
          label: {
            show: true
          },
          color: '#536fc4',
        }]
      };
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
.echart {
  width: 1200px;
  height: 500px;
  margin: 10px;
}
</style>
