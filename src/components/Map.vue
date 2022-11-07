<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref">map</div>
  </div>
</template>

<script>
import { inject, onMounted, reactive } from "vue";
import axios from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils";
export default {
  data() {
    const chartInstance = null;
    return {
      allData: null,
    };
  },
  created() {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack("mapData", this.getData);
  },
  mounted() {
    this.initChart();
    //this.getDate();
    this.$socket.send({
      action: "getData",
      socketType: "mapData",
      chartName: "map",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("mapData");
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, "dark");
      const ret = await axios.get("http://localhost:8080/static/map/china.json");
      console.log("map" + ret);
      echarts.registerMap("china", ret.data);
      const initOption = {
        title: {
          text: "▎ 商家分布",
          left: 20,
          top: 20,
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: "#2E72BF",
            borderColor: "#333",
          },
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("click", async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name);
        console.log(provinceInfo);
        const ret = await axios.get("http://localhost:8080" + provinceInfo.path);
        echarts.registerMap(provinceInfo.key, ret.data);
        const changeOption = {
          geo: {
            map: provinceInfo.key,
          },
        };
        this.chartInstance.setOption(changeOption);
      });
    },
    getDate(ret) {
      //const { data: ret } = await axios.get("map");
      console.log(ret);
      this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      const legendArr = this.allData.map((item) => {
        return item.name;
      });
      const seriesArr = this.allData.map((item) => {
        return {
          type: "effectScatter",
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
        };
      });
      const dataOption = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    // 回到中国地图
    revertMap() {
      const revertOption = {
        geo: {
          map: "china",
        },
      };
      this.chartInstance.setOption(revertOption);
    },
  },
};
</script>

<style scoped></style>
