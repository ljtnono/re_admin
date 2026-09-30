<template>
  <div class="system-monitor-container p20 flex flex1 flex-direction-column">
    <!-- cpu、内存、负载概览信息 -->
    <div class="cpu-memory-overview-container flex flex-direction-row flex-justify-content-space-between">
      <el-card class="flex" shadow="hover">
        <template #header>
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
        <template #header>
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
        <template #header>
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
        <template #header>
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
    <!-- 监控图表：每个图表独立卡片 -->
    <div class="chart-overview-container mt20">
      <div class="chart-section-header flex flex-direction-row flex-justify-content-space-between flex-align-items-center">
        <span class="chart-section-title">监控图表</span>
        <span class="chart-tip">最近5分钟，每5秒采样</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <span class="chart-card-title">CPU 使用率</span>
            </template>
            <div ref="cpuChartRef" class="chart-item" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <span class="chart-card-title">内存使用率</span>
            </template>
            <div ref="memoryChartRef" class="chart-item" />
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt20">
        <el-col :span="12">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <span class="chart-card-title">系统负载</span>
            </template>
            <div ref="loadChartRef" class="chart-item" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <span class="chart-card-title">磁盘 IO</span>
            </template>
            <div ref="diskChartRef" class="chart-item" />
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt20">
        <el-col :span="24">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <span class="chart-card-title">网络 IO</span>
            </template>
            <div ref="networkChartRef" class="chart-item chart-item--full" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import { ElLoading } from "element-plus";
import { findCPUInfo, findHardDiskInfo, findIOInfo, findMemoryInfo } from "@/api/systemMonitor";
import { ELEMENT_PAGE_LOADING_CONFIG } from "@/config/commonConfig";

defineOptions({ name: "SystemMonitor" });

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

// cpu信息（含1/5/15分钟负载）
const cpuInfo = ref({
  cpuCoreNum: null,
  userUsedPercent: null,
  systemUsedPercent: null,
  freePercent: null,
  loadAverage1: null,
  loadAverage5: null,
  loadAverage15: null
});
// 内存信息
const memoryInfo = ref({
  totalMemory: null,
  usedMemory: null,
  availableMemory: null,
  memoryUsedPercent: null
});
// 硬盘信息列表
const hardDiskInfoList = ref([]);
// 磁盘、网络IO速率信息
const ioInfo = ref({
  diskReadRate: null,
  diskWriteRate: null,
  networkRecvRate: null,
  networkSendRate: null
});
// 曲线图时间轴数据
const chartTimes = ref([]);
// 曲线图各数据点的时间戳（毫秒）
const chartEpochs = ref([]);
// cpu用户使用率曲线数据
const cpuUserData = ref([]);
// cpu系统使用率曲线数据
const cpuSysData = ref([]);
// 内存使用率曲线数据
const memoryUsedData = ref([]);
// 磁盘读取速率曲线数据
const diskReadData = ref([]);
// 磁盘写入速率曲线数据
const diskWriteData = ref([]);
// 网络接收速率曲线数据
const networkRecvData = ref([]);
// 网络发送速率曲线数据
const networkSendData = ref([]);
// 系统负载柱状图数据（1/5/15分钟）
const loadData = ref([]);
// 磁盘IO图表当前单位（随数值自动升级）
const diskRateUnit = ref({ unit: "KB/s", divisor: 1 });
// 网络IO图表当前单位（随数值自动升级）
const networkRateUnit = ref({ unit: "KB/s", divisor: 1 });
// echarts图表实例
let cpuChart = null;
let memoryChart = null;
let loadChart = null;
let diskChart = null;
let networkChart = null;
// 窗口resize监听函数
let resizeHandler = null;
// 定时获取监控信息的定时器
let fetchTimer = null;

// dom引用
const cpuChartRef = ref(null);
const memoryChartRef = ref(null);
const loadChartRef = ref(null);
const diskChartRef = ref(null);
const networkChartRef = ref(null);

// 获取cpu、内存、硬盘、IO信息
const fetchSystemMonitor = async () => {
  await findCPUInfo().then(res => {
    cpuInfo.value = res.data.data;
  });
  await findMemoryInfo().then(res => {
    memoryInfo.value = res.data.data;
  });
  await findHardDiskInfo().then(res => {
    hardDiskInfoList.value = res.data.data;
  });
  await findIOInfo().then(res => {
    ioInfo.value = res.data.data;
  });
  appendChartData();
  updateCharts();
};

// 将当前监控数据追加到曲线图数据集中
const appendChartData = () => {
  const now = new Date();
  chartEpochs.value.push(now.getTime());
  chartTimes.value.push(formatTime(now));
  cpuUserData.value.push(parsePercent(cpuInfo.value.userUsedPercent));
  cpuSysData.value.push(parsePercent(cpuInfo.value.systemUsedPercent));
  memoryUsedData.value.push(parsePercent(memoryInfo.value.memoryUsedPercent));
  diskReadData.value.push(parseRate(ioInfo.value.diskReadRate));
  diskWriteData.value.push(parseRate(ioInfo.value.diskWriteRate));
  networkRecvData.value.push(parseRate(ioInfo.value.networkRecvRate));
  networkSendData.value.push(parseRate(ioInfo.value.networkSendRate));
  // 负载柱状图只保留最新一组数据
  loadData.value = [
    parseNumber(cpuInfo.value.loadAverage1),
    parseNumber(cpuInfo.value.loadAverage5),
    parseNumber(cpuInfo.value.loadAverage15)
  ];
  // 超出最大点数后丢弃最早的数据
  if (chartTimes.value.length > MAX_CHART_POINTS) {
    chartEpochs.value.shift();
    chartTimes.value.shift();
    cpuUserData.value.shift();
    cpuSysData.value.shift();
    memoryUsedData.value.shift();
    diskReadData.value.shift();
    diskWriteData.value.shift();
    networkRecvData.value.shift();
    networkSendData.value.shift();
  }
  saveChartCache();
};

// 格式化时间为HH:mm:ss
const formatTime = (date) => {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map(num => String(num).padStart(2, "0"))
    .join(":");
};

// 将图表数据缓存到本地，下次打开页面时恢复
const saveChartCache = () => {
  try {
    localStorage.setItem(CHART_CACHE_KEY, JSON.stringify({
      epochs: chartEpochs.value,
      cpuUser: cpuUserData.value,
      cpuSys: cpuSysData.value,
      memoryUsed: memoryUsedData.value,
      diskRead: diskReadData.value,
      diskWrite: diskWriteData.value,
      networkRecv: networkRecvData.value,
      networkSend: networkSendData.value,
      load: loadData.value
    }));
  } catch (e) {
    // 本地缓存不可用时忽略
  }
};

// 从本地缓存恢复图表数据，仅保留5分钟内的数据点
const loadChartCache = () => {
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
  const cutoff = Date.now() - MAX_CHART_POINTS * 5000;
  const start = cache.epochs.findIndex(epoch => epoch >= cutoff);
  if (start === -1) {
    localStorage.removeItem(CHART_CACHE_KEY);
    return;
  }
  chartEpochs.value = cache.epochs.slice(start);
  chartTimes.value = chartEpochs.value.map(epoch => formatTime(new Date(epoch)));
  cpuUserData.value = (cache.cpuUser || []).slice(start);
  cpuSysData.value = (cache.cpuSys || []).slice(start);
  memoryUsedData.value = (cache.memoryUsed || []).slice(start);
  diskReadData.value = (cache.diskRead || []).slice(start);
  diskWriteData.value = (cache.diskWrite || []).slice(start);
  networkRecvData.value = (cache.networkRecv || []).slice(start);
  networkSendData.value = (cache.networkSend || []).slice(start);
  loadData.value = cache.load || [null, null, null];
};

// 解析百分比字符串为数值，如 "32.84%" -> 32.84
const parsePercent = (value) => {
  return value ? parseFloat(value) : null;
};

// 解析数字字符串为数值
const parseNumber = (value) => {
  return value ? parseFloat(value) : null;
};

// 解析速率字符串为数值（统一换算为KB/s），如 "1.5MB/s" -> 1536，"500B/s" -> 0.49
const parseRate = (value) => {
  if (!value) {
    return null;
  }
  const num = parseFloat(value);
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
};

// 求数据中的最大值（忽略null）
const maxValue = (list) => {
  let max = 0;
  list.forEach(value => {
    if (value != null && value > max) {
      max = value;
    }
  });
  return max;
};

// 根据最大值（KB/s）自动选择合适的速率单位
const autoRateUnit = (maxKB) => {
  if (maxKB >= 1024 * 1024) {
    return { unit: "GB/s", divisor: 1024 * 1024 };
  }
  if (maxKB >= 1024) {
    return { unit: "MB/s", divisor: 1024 };
  }
  return { unit: "KB/s", divisor: 1 };
};

// 按单位换算速率数据
const convertRateData = (data, divisor) => {
  return data.map(value => value == null ? null : Math.round(value / divisor * 100) / 100);
};

// 垂直方向渐变面积样式
const areaGradient = (color) => {
  return {
    color: {
      type: "linear",
      x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [
        { offset: 0, color: color + "66" },
        { offset: 1, color: color + "05" }
      ]
    }
  };
};

// 折线图基础配置
const baseLineOption = (title, seriesList, yAxisName, unit) => {
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
      areaStyle: s.area ? areaGradient(s.color) : undefined
    }))
  };
};

// 初始化echarts图表
const initCharts = () => {
  // cpu使用率：渐变面积图，单位 %
  cpuChart = echarts.init(cpuChartRef.value);
  cpuChart.setOption(baseLineOption("CPU使用率", [
    { name: "用户使用率", color: CHART_COLORS.blue, area: true },
    { name: "系统使用率", color: CHART_COLORS.yellow, area: true }
  ], "%", "%"));
  // 内存使用率：仪表盘，单位 %
  memoryChart = echarts.init(memoryChartRef.value);
  memoryChart.setOption({
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
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: { show: false },
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
      data: [{ value: 0, name: "已使用" }]
    }]
  });
  // 系统负载：柱状图，单位 负载
  loadChart = echarts.init(loadChartRef.value);
  loadChart.setOption({
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
      axisPointer: { type: "shadow" },
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
            { offset: 0, color: CHART_COLORS.purpleLight },
            { offset: 1, color: CHART_COLORS.purple }
          ]
        }
      }
    }]
  });
  // 磁盘IO：渐变面积折线图，单位 KB/s
  diskChart = echarts.init(diskChartRef.value);
  diskChart.setOption(baseLineOption("磁盘IO", [
    { name: "读取速率", color: CHART_COLORS.cyan, area: true },
    { name: "写入速率", color: CHART_COLORS.orange, area: true }
  ], "KB/s", "KB/s"));
  // 网络IO：渐变面积折线图，单位 KB/s
  networkChart = echarts.init(networkChartRef.value);
  networkChart.setOption(baseLineOption("网络IO", [
    { name: "接收速率", color: CHART_COLORS.blue, area: true },
    { name: "发送速率", color: CHART_COLORS.orange, area: true }
  ], "KB/s", "KB/s"));
  resizeHandler = () => {
    [cpuChart, memoryChart, loadChart, diskChart, networkChart].forEach(chart => {
      if (chart) {
        chart.resize();
      }
    });
  };
  window.addEventListener("resize", resizeHandler);
};

// 用最新数据刷新图表
const updateCharts = () => {
  if (!cpuChart) {
    return;
  }
  // 根据当前数据最大值自动选择IO图表单位
  diskRateUnit.value = autoRateUnit(maxValue([...diskReadData.value, ...diskWriteData.value]));
  networkRateUnit.value = autoRateUnit(maxValue([...networkRecvData.value, ...networkSendData.value]));
  cpuChart.setOption({
    xAxis: { data: chartTimes.value },
    series: [{ data: cpuUserData.value }, { data: cpuSysData.value }]
  });
  memoryChart.setOption({
    series: [{ data: [{ value: memoryUsedData.value[memoryUsedData.value.length - 1] || 0, name: "已使用" }] }]
  });
  loadChart.setOption({
    series: [{ data: loadData.value }]
  });
  diskChart.setOption({
    tooltip: { valueFormatter: value => value == null ? "-" : value + " " + diskRateUnit.value.unit },
    yAxis: {
      name: diskRateUnit.value.unit,
      axisLabel: { formatter: "{value} " + diskRateUnit.value.unit }
    },
    xAxis: { data: chartTimes.value },
    series: [
      { data: convertRateData(diskReadData.value, diskRateUnit.value.divisor) },
      { data: convertRateData(diskWriteData.value, diskRateUnit.value.divisor) }
    ]
  });
  networkChart.setOption({
    tooltip: { valueFormatter: value => value == null ? "-" : value + " " + networkRateUnit.value.unit },
    yAxis: {
      name: networkRateUnit.value.unit,
      axisLabel: { formatter: "{value} " + networkRateUnit.value.unit }
    },
    xAxis: { data: chartTimes.value },
    series: [
      { data: convertRateData(networkRecvData.value, networkRateUnit.value.divisor) },
      { data: convertRateData(networkSendData.value, networkRateUnit.value.divisor) }
    ]
  });
};

onMounted(async () => {
  // 先从本地缓存恢复图表历史数据
  loadChartCache();
  initCharts();
  // 这里第一次先获取一下数据，否则会导致第一次进入页面需要等待5s的时间
  const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
  await fetchSystemMonitor();
  loading.close();
  fetchTimer = setInterval(fetchSystemMonitor, 5000);
});

onBeforeUnmount(() => {
  clearInterval(fetchTimer);
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }
  [cpuChart, memoryChart, loadChart, diskChart, networkChart].forEach(chart => {
    if (chart) {
      chart.dispose();
    }
  });
});
</script>

<style lang="scss" scoped>
.system-monitor-container {

  .cpu-memory-overview-container {

    .el-card {
      width: calc((100% - 20px) / 3);
      height: 100%;
      display: inline-block;

      :deep(.el-card__header) {
        height: 60px;
        padding: 20px;
        font-size: 14px;
      }

      :deep(.el-card__header) {
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
      :deep(.el-card__header) {
        border-bottom: none;
      }
    }
  }

  .chart-overview-container {
    .chart-section-header {
      padding: 0 4px 12px;
    }

    .chart-section-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
    }

    .chart-tip {
      color: #909399;
      font-size: 12px;
    }

    .chart-card {
      :deep(.el-card__header) {
        padding: 12px 16px;
        border-bottom: 1px solid #f2f6fc;
      }

      .chart-card-title {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
      }

      :deep(.el-card__body) {
        padding: 8px 12px 12px;
      }
    }

    .chart-item {
      width: 100%;
      height: 300px;
    }
  }
}
</style>
