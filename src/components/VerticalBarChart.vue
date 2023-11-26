<template>
  <div>
    <div ref="echart" class="echart"></div>
  </div>
</template>

<script>
export default {
  name: "VerticalBarChart",
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
        xAxis: {
          type: 'category',
          data: ['XSS攻击', '敏感文件攻击', '命令执行攻击', 'sql注入攻击', 'webshell连接攻击']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.data,
            type: 'bar',
            label: {
              show: true
            },
          }
        ]
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
  width: 800px;
  height: 400px;
  margin: 10px;
}
</style>
