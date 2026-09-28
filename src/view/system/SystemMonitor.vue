<template>
  <div class="system-monitor-container p20 flex flex1 flex-direction-column">
    <!-- cpu、内存、负载概览信息 -->
    <div class="cpu-memory-overview-container flex flex-direction-row flex-justify-content-space-between">
      <el-card class="flex" shadow="hover">
        <template slot="header">
          <div class="flex flex-direction-row flex-justify-content-space-between">
            <span>CPU</span>
          </div>
        </template>
        <div class="card-body-container flex flex-direction-row flex-justify-content-space-between">
          <div class="text-item flex flex-direction-column">
            <span>{{ cpuInfo.cpuCoreNum }}</span>
            <span>核心数</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ cpuInfo.userUsedPercent }}</span>
            <span>用户使用率</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ cpuInfo.systemUsedPercent }}</span>
            <span>系统使用率</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ cpuInfo.freePercent }}</span>
            <span>当前空闲率</span>
          </div>
        </div>
      </el-card>
      <el-card class="flex" shadow="hover">
        <template slot="header">
          <div class="flex flex-direction-row flex-justify-content-space-between">
            <span>内存</span>
          </div>
        </template>
        <div class="card-body-container flex flex-direction-row flex-justify-content-space-between">
          <div class="text-item flex flex-direction-column">
            <span>{{ memoryInfo.totalMemory }}</span>
            <span>总内存</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ memoryInfo.usedMemory }}</span>
            <span>已用内存</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ memoryInfo.availableMemory }}</span>
            <span>可用内存</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ memoryInfo.memoryUsedPercent }}</span>
            <span>使用率</span>
          </div>
        </div>
      </el-card>
      <el-card class="flex" shadow="hover">
        <template slot="header">
          <div class="flex flex-direction-row flex-justify-content-space-between">
            <span>负载状态</span>
          </div>
        </template>
        <div class="card-body-container flex flex-direction-row flex-justify-content-space-between">
          <div class="text-item flex flex-direction-column">
            <span>{{ cpuInfo.loadAverage1 }}</span>
            <span>1分钟负载</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ cpuInfo.loadAverage5 }}</span>
            <span>5分钟负载</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ cpuInfo.loadAverage15 }}</span>
            <span>15分钟负载</span>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 硬盘状态 -->
    <div class="hard-overview-container mt20">
      <el-card shadow="hover">
        <template slot="header">
          <div class="flex flex-direction-row flex-justify-content-space-between">
            <span>硬盘状态</span>
          </div>
        </template>
        <el-table
          stripe
          max-height="400"
          :data="hardDiskInfoList"
          style="width: 100%">
          <el-table-column prop="mountPoint" label="盘符路径" />
          <el-table-column prop="fileSystem" label="文件系统" />
          <el-table-column prop="totalSize" label="总大小" />
          <el-table-column prop="availableSize" label="可用大小" />
          <el-table-column prop="usedSize" label="已用大小" />
          <el-table-column prop="usedPercent" label="已用百分比" />
        </el-table>
      </el-card>
    </div>
    <!-- 监控图表 -->
    <div class="chart-overview-container mt20">
      <el-card shadow="hover">
        <template slot="header">
          <div class="flex flex-direction-row flex-justify-content-space-between">
            <span>监控图表</span>
            <span class="chart-tip">最近5分钟，每5秒采样</span>
          </div>
        </template>
        <div class="chart-row flex flex-direction-row flex-justify-content-space-between">
          <div ref="cpuChart" class="chart-item" />
          <div ref="memoryChart" class="chart-item" />
        </div>
        <div class="chart-row mt20 flex flex-direction-row flex-justify-content-space-between">
          <div ref="loadChart" class="chart-item" />
          <div ref="diskChart" class="chart-item" />
        </div>
        <div class="chart-row mt20">
          <div ref="networkChart" class="chart-item-full" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { findCPUInfo, findHardDiskInfo, findIOInfo, findMemoryInfo } from "@/api/systemMonitor";
import {ELEMENT_PAGE_LOADING_CONFIG} from "@/config/commonConfig";

// 曲线图最多保留的数据点数（5s * 60 = 5分钟）
const MAX_CHART_POINTS = 60;

// 监控图表数据本地缓存key
const CHART_CACHE_KEY = "systemMonitorChartCache";

// 图表配色
const CHART_COLORS = {
  blue: "#3b8bff",
  cyan: "#36cfc9",
  yellow: "#ffc53d",
  orange: "#ff7a45",
  purple: "#9254de",
  purpleLight: "#b37feb"
};

export default {
  name: "SystemMonitor",
  data() {
    return {
      // cpu信息（含1/5/15分钟负载）
      cpuInfo: {
        cpuCoreNum: null,
        userUsedPercent: null,
        systemUsedPercent: null,
        freePercent: null,
        loadAverage1: null,
        loadAverage5: null,
        loadAverage15: null
      },
      // 内存信息
      memoryInfo: {
        totalMemory: null,
        usedMemory: null,
        availableMemory: null,
        memoryUsedPercent: null
      },
      // 硬盘信息列表
      hardDiskInfoList: [],
      // 磁盘、网络IO速率信息
      ioInfo: {
        diskReadRate: null,
        diskWriteRate: null,
        networkRecvRate: null,
        networkSendRate: null
      },
      // 曲线图时间轴数据
      chartTimes: [],
      // 曲线图各数据点的时间戳（毫秒）
      chartEpochs: [],
      // cpu用户使用率曲线数据
      cpuUserData: [],
      // cpu系统使用率曲线数据
      cpuSysData: [],
      // 内存使用率曲线数据
      memoryUsedData: [],
      // 磁盘读取速率曲线数据
      diskReadData: [],
      // 磁盘写入速率曲线数据
      diskWriteData: [],
      // 网络接收速率曲线数据
      networkRecvData: [],
      // 网络发送速率曲线数据
      networkSendData: [],
      // 系统负载柱状图数据（1/5/15分钟）
      loadData: [],
      // 磁盘IO图表当前单位（随数值自动升级）
      diskRateUnit: {unit: "KB/s", divisor: 1},
      // 网络IO图表当前单位（随数值自动升级）
      networkRateUnit: {unit: "KB/s", divisor: 1},
      // echarts图表实例
      cpuChart: null,
      memoryChart: null,
      loadChart: null,
      diskChart: null,
      networkChart: null,
      // 窗口resize监听函数
      resizeHandler: null,
      // 定时获取监控信息的定时器
      fetchTimer: null
    }
  },
  methods: {
    // 获取cpu、内存、硬盘、IO信息
    async fetchSystemMonitor() {
      await findCPUInfo().then(res => {
        this.cpuInfo = res.data.data;
      });
      await findMemoryInfo().then(res => {
        this.memoryInfo = res.data.data;
      });
      await findHardDiskInfo().then(res => {
        this.hardDiskInfoList = res.data.data;
      });
      await findIOInfo().then(res => {
        this.ioInfo = res.data.data;
      });
      this.appendChartData();
      this.updateCharts();
    },
    // 将当前监控数据追加到曲线图数据集中
    appendChartData() {
      let now = new Date();
      this.chartEpochs.push(now.getTime());
      this.chartTimes.push(this.formatTime(now));
      this.cpuUserData.push(this.parsePercent(this.cpuInfo.userUsedPercent));
      this.cpuSysData.push(this.parsePercent(this.cpuInfo.systemUsedPercent));
      this.memoryUsedData.push(this.parsePercent(this.memoryInfo.memoryUsedPercent));
      this.diskReadData.push(this.parseRate(this.ioInfo.diskReadRate));
      this.diskWriteData.push(this.parseRate(this.ioInfo.diskWriteRate));
      this.networkRecvData.push(this.parseRate(this.ioInfo.networkRecvRate));
      this.networkSendData.push(this.parseRate(this.ioInfo.networkSendRate));
      // 负载柱状图只保留最新一组数据
      this.loadData = [
        this.parseNumber(this.cpuInfo.loadAverage1),
        this.parseNumber(this.cpuInfo.loadAverage5),
        this.parseNumber(this.cpuInfo.loadAverage15)
      ];
      // 超出最大点数后丢弃最早的数据
      if (this.chartTimes.length > MAX_CHART_POINTS) {
        this.chartEpochs.shift();
        this.chartTimes.shift();
        this.cpuUserData.shift();
        this.cpuSysData.shift();
        this.memoryUsedData.shift();
        this.diskReadData.shift();
        this.diskWriteData.shift();
        this.networkRecvData.shift();
        this.networkSendData.shift();
      }
      this.saveChartCache();
    },
    // 格式化时间为HH:mm:ss
    formatTime(date) {
      return [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map(num => String(num).padStart(2, "0"))
        .join(":");
    },
    // 将图表数据缓存到本地，下次打开页面时恢复
    saveChartCache() {
      try {
        localStorage.setItem(CHART_CACHE_KEY, JSON.stringify({
          epochs: this.chartEpochs,
          cpuUser: this.cpuUserData,
          cpuSys: this.cpuSysData,
          memoryUsed: this.memoryUsedData,
          diskRead: this.diskReadData,
          diskWrite: this.diskWriteData,
          networkRecv: this.networkRecvData,
          networkSend: this.networkSendData,
          load: this.loadData
        }));
      } catch (e) {
        // 本地缓存不可用时忽略
      }
    },
    // 从本地缓存恢复图表数据，仅保留5分钟内的数据点
    loadChartCache() {
      let cache = null;
      try {
        cache = JSON.parse(localStorage.getItem(CHART_CACHE_KEY));
      } catch (e) {
        cache = null;
      }
      if (!cache || !cache.epochs || cache.epochs.length === 0) {
        return;
      }
      // 只保留最近5分钟内的数据点
      let cutoff = Date.now() - MAX_CHART_POINTS * 5000;
      let start = cache.epochs.findIndex(epoch => epoch >= cutoff);
      if (start === -1) {
        localStorage.removeItem(CHART_CACHE_KEY);
        return;
      }
      this.chartEpochs = cache.epochs.slice(start);
      this.chartTimes = this.chartEpochs.map(epoch => this.formatTime(new Date(epoch)));
      this.cpuUserData = (cache.cpuUser || []).slice(start);
      this.cpuSysData = (cache.cpuSys || []).slice(start);
      this.memoryUsedData = (cache.memoryUsed || []).slice(start);
      this.diskReadData = (cache.diskRead || []).slice(start);
      this.diskWriteData = (cache.diskWrite || []).slice(start);
      this.networkRecvData = (cache.networkRecv || []).slice(start);
      this.networkSendData = (cache.networkSend || []).slice(start);
      this.loadData = cache.load || [null, null, null];
    },
    // 解析百分比字符串为数值，如 "32.84%" -> 32.84
    parsePercent(value) {
      return value ? parseFloat(value) : null;
    },
    // 解析数字字符串为数值
    parseNumber(value) {
      return value ? parseFloat(value) : null;
    },
    // 解析速率字符串为数值（统一换算为KB/s），如 "1.5MB/s" -> 1536，"500B/s" -> 0.49
    parseRate(value) {
      if (!value) {
        return null;
      }
      let num = parseFloat(value);
      if (value.indexOf("MB/s") !== -1) {
        return Math.round(num * 1024 * 100) / 100;
      }
      if (value.indexOf("KB/s") !== -1) {
        return num;
      }
      if (value.indexOf("GB/s") !== -1) {
        return Math.round(num * 1024 * 1024 * 100) / 100;
      }
      return Math.round(num / 1024 * 100) / 100;
    },
    // 求数据中的最大值（忽略null）
    maxValue(list) {
      let max = 0;
      list.forEach(value => {
        if (value != null && value > max) {
          max = value;
        }
      });
      return max;
    },
    // 根据最大值（KB/s）自动选择合适的速率单位
    autoRateUnit(maxKB) {
      if (maxKB >= 1024 * 1024) {
        return {unit: "GB/s", divisor: 1024 * 1024};
      }
      if (maxKB >= 1024) {
        return {unit: "MB/s", divisor: 1024};
      }
      return {unit: "KB/s", divisor: 1};
    },
    // 按单位换算速率数据
    convertRateData(data, divisor) {
      return data.map(value => value == null ? null : Math.round(value / divisor * 100) / 100);
    },
    // 垂直方向渐变面积样式
    areaGradient(color) {
      return {
        color: {
          type: "linear",
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            {offset: 0, color: color + "66"},
            {offset: 1, color: color + "05"}
          ]
        }
      };
    },
    // 折线图基础配置
    baseLineOption(title, seriesList, yAxisName, unit) {
      return {
        color: seriesList.map(s => s.color),
        title: {
          text: title,
          left: "center",
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "axis",
          valueFormatter: value => value == null ? "-" : value + " " + unit
        },
        legend: {
          bottom: 0,
          data: seriesList.map(s => s.name)
        },
        grid: {
          left: "60",
          right: "20",
          top: "40",
          bottom: "50"
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: "value",
          name: unit,
          min: 0,
          max: unit === "%" ? 100 : null,
          axisLabel: {
            formatter: "{value} " + unit
          }
        },
        series: seriesList.map(s => ({
          name: s.name,
          type: "line",
          smooth: true,
          showSymbol: false,
          data: [],
          areaStyle: s.area ? this.areaGradient(s.color) : undefined
        }))
      };
    },
    // 初始化echarts图表
    initCharts() {
      // cpu使用率：渐变面积图，单位 %
      this.cpuChart = this.$echarts.init(this.$refs.cpuChart);
      this.cpuChart.setOption(this.baseLineOption("CPU使用率", [
        {name: "用户使用率", color: CHART_COLORS.blue, area: true},
        {name: "系统使用率", color: CHART_COLORS.yellow, area: true}
      ], "%", "%"));
      // 内存使用率：仪表盘，单位 %
      this.memoryChart = this.$echarts.init(this.$refs.memoryChart);
      this.memoryChart.setOption({
        color: [CHART_COLORS.cyan],
        title: {
          text: "内存使用率",
          left: "center",
          textStyle: {
            fontSize: 14
          }
        },
        series: [{
          type: "gauge",
          min: 0,
          max: 100,
          radius: "72%",
          // 按使用率等级变色：<60%绿色、60-85%橙色、>85%红色
          axisLine: {
            lineStyle: {
              width: 16,
              color: [
                [0.6, "#52c41a"],
                [0.85, "#faad14"],
                [1, "#f5222d"]
              ]
            }
          },
          progress: {
            show: true,
            width: 16
          },
          axisTick: {show: false},
          splitLine: {show: false},
          axisLabel: {show: false},
          pointer: {show: false},
          title: {
            show: true,
            offsetCenter: [0, "32%"],
            fontSize: 14,
            color: "#666"
          },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, "0%"],
            fontSize: 26,
            color: "#333",
            formatter: "{value} %"
          },
          data: [{value: 0, name: "已使用"}]
        }]
      });
      // 系统负载：柱状图，单位 负载
      this.loadChart = this.$echarts.init(this.$refs.loadChart);
      this.loadChart.setOption({
        color: [CHART_COLORS.purple],
        title: {
          text: "系统负载",
          left: "center",
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {type: "shadow"},
          valueFormatter: value => value == null ? "-" : String(value)
        },
        grid: {
          left: "60",
          right: "20",
          top: "40",
          bottom: "30"
        },
        xAxis: {
          type: "category",
          data: ["1分钟", "5分钟", "15分钟"]
        },
        yAxis: {
          type: "value",
          name: "负载",
          min: 0,
          axisLabel: {
            formatter: "{value}"
          }
        },
        series: [{
          type: "bar",
          barWidth: "40%",
          data: [],
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                {offset: 0, color: CHART_COLORS.purpleLight},
                {offset: 1, color: CHART_COLORS.purple}
              ]
            }
          },
          label: {
            show: true,
            position: "top",
            color: "#666"
          }
        }]
      });
      // 磁盘IO：渐变面积折线图，单位 KB/s
      this.diskChart = this.$echarts.init(this.$refs.diskChart);
      this.diskChart.setOption(this.baseLineOption("磁盘IO", [
        {name: "读取速率", color: CHART_COLORS.cyan, area: true},
        {name: "写入速率", color: CHART_COLORS.orange, area: true}
      ], "KB/s", "KB/s"));
      // 网络IO：渐变面积折线图，单位 KB/s
      this.networkChart = this.$echarts.init(this.$refs.networkChart);
      this.networkChart.setOption(this.baseLineOption("网络IO", [
        {name: "接收速率", color: CHART_COLORS.blue, area: true},
        {name: "发送速率", color: CHART_COLORS.orange, area: true}
      ], "KB/s", "KB/s"));
      this.resizeHandler = () => {
        [this.cpuChart, this.memoryChart, this.loadChart, this.diskChart, this.networkChart].forEach(chart => {
          if (chart) {
            chart.resize();
          }
        });
      };
      window.addEventListener("resize", this.resizeHandler);
    },
    // 用最新数据刷新图表
    updateCharts() {
      if (!this.cpuChart) {
        return;
      }
      // 根据当前数据最大值自动选择IO图表单位
      this.diskRateUnit = this.autoRateUnit(this.maxValue([...this.diskReadData, ...this.diskWriteData]));
      this.networkRateUnit = this.autoRateUnit(this.maxValue([...this.networkRecvData, ...this.networkSendData]));
      this.cpuChart.setOption({
        xAxis: {data: this.chartTimes},
        series: [{data: this.cpuUserData}, {data: this.cpuSysData}]
      });
      this.memoryChart.setOption({
        series: [{data: [{value: this.memoryUsedData[this.memoryUsedData.length - 1] || 0, name: "已使用"}]}]
      });
      this.loadChart.setOption({
        series: [{data: this.loadData}]
      });
      this.diskChart.setOption({
        tooltip: {valueFormatter: value => value == null ? "-" : value + " " + this.diskRateUnit.unit},
        yAxis: {
          name: this.diskRateUnit.unit,
          axisLabel: {formatter: "{value} " + this.diskRateUnit.unit}
        },
        xAxis: {data: this.chartTimes},
        series: [
          {data: this.convertRateData(this.diskReadData, this.diskRateUnit.divisor)},
          {data: this.convertRateData(this.diskWriteData, this.diskRateUnit.divisor)}
        ]
      });
      this.networkChart.setOption({
        tooltip: {valueFormatter: value => value == null ? "-" : value + " " + this.networkRateUnit.unit},
        yAxis: {
          name: this.networkRateUnit.unit,
          axisLabel: {formatter: "{value} " + this.networkRateUnit.unit}
        },
        xAxis: {data: this.chartTimes},
        series: [
          {data: this.convertRateData(this.networkRecvData, this.networkRateUnit.divisor)},
          {data: this.convertRateData(this.networkSendData, this.networkRateUnit.divisor)}
        ]
      });
    },
  },
  destroyed() {
    clearInterval(this.fetchTimer);
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
    [this.cpuChart, this.memoryChart, this.loadChart, this.diskChart, this.networkChart].forEach(chart => {
      if (chart) {
        chart.dispose();
      }
    });
  },
  async mounted() {
    // 先从本地缓存恢复图表历史数据
    this.loadChartCache();
    this.initCharts();
    // 这里第一次先获取一下数据，否则会导致第一次进入页面需要等待5s的时间
    this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
    await this.fetchSystemMonitor();
    this.$loading().close();
    this.fetchTimer = setInterval(this.fetchSystemMonitor, 5000);
  }
};
</script>

<style lang="scss" scoped>
.system-monitor-container {

  .cpu-memory-overview-container {

    .el-card {
      width: calc((100% - 20px) / 3);
      height: 100%;
      display: inline-block;

      ::v-deep .el-card__header {
        height: 60px;
        padding: 20px;
        font-size: 14px;
      }

      ::v-deep .el-card__header {
        border-bottom: none;
      }

      .card-body-container {
        width: 100%;

        .text-item {
          height: 100px;
          vertical-align: center;
          text-align: center;

          span {
            display: block;
            margin-top: 10px;

            &:nth-child(1) {
              font-size: 24px;
            }

            &:nth-child(2) {
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .hard-overview-container {
    .el-card {
      ::v-deep .el-card__header {
        border-bottom: none;
      }
    }
  }

  .chart-overview-container {
    .el-card {
      ::v-deep .el-card__header {
        border-bottom: none;
      }

      .chart-tip {
        color: #909399;
        font-size: 12px;
      }

      .chart-item {
        width: calc(50% - 10px);
        height: 300px;
      }

      .chart-item-full {
        width: 100%;
        height: 300px;
      }
    }
  }
}
</style>
