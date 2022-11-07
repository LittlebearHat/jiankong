<!-- 地区销售排行 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref">rank</div>
  </div>
</template>

<script>
import { inject, onMounted, reactive } from "vue";
import axios from "axios";
export default {
  data() {
    const chartInstanc = null;
    return {
      allData: null,
      startValue: 0, // 区域缩放的起点值
      endValue: 9, // 区域缩放的终点值
      timerId: null, // 定时器的标识
      flag1: true,
      flag2: false,
    };
  },
  created() {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack("rankData", this.getData);
  },
  mounted() {
    this.initChart();
    //this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "rankData",
      chartName: "rank",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timerId);
    this.$socket.unRegisterCallBack("rankData");
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, "dark");
      const initOption = {
        title: {
          text: "▎ 地区销售排行",
          left: 20,
          top: 20,
        },
        grid: {
          top: "40%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    getData(ret) {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      this.allData = ret;
      // 对allData里面的每一个元素进行排序, 从大到小进行
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
      console.log(this.allData);
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];
      // 处理图表需要的数据
      // 所有省份所形成的数组
      const provinceArr = this.allData.map((item) => {
        return item.name;
      });
      // 所有省份对应的销售金额
      const valueArr = this.allData.map((item) => {
        return item.value;
      });
      const dataOption = {
        xAxis: {
          data: provinceArr,
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null;
                if (arg.value > 300) {
                  targetColorArr = colorArr[0];
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1];
                } else {
                  targetColorArr = colorArr[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0],
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1],
                  },
                ]);
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;
      //   console.log(titleFontSize);
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [6, 6, 0, 0], //有bug，未知
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        if (this.flag1) {
          this.startValue++;
          this.endValue++;
          if (this.endValue > this.allData.length - 1) {
            this.flag1 = false;
            this.flag2 = true;
          }
        }
        if (this.flag2) {
          this.startValue--;
          this.endValue--;
          if (this.startValue == 0) {
            this.flag1 = true;
            this.flag2 = false;
          }
        }
        this.updateChart();
      }, 2000);
    },
  },
};
</script>

<style lang="less" scoped></style>
