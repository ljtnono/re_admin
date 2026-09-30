<template>
  <div class="workspace">
    <!-- 欢迎横幅 -->
    <section class="welcome">
      <div class="welcome__text">
        <h2 class="welcome__greeting">{{ greeting }}，{{ username }}</h2>
        <p class="welcome__date">{{ todayStr }}</p>
      </div>
      <el-button class="welcome__write-btn" @click="$router.push({name: 'WriteArticle'})">
        <i class="iconfont icon-add"/>
        <span>去写文章</span>
      </el-button>
    </section>

    <!-- 统计卡片 -->
    <section class="stat-grid">
      <div v-for="card in statCards" :key="card.label" class="stat-card">
        <div class="stat-card__icon" :style="{background: card.bg, color: card.color}">
          <i class="iconfont" :class="card.icon"/>
        </div>
        <div class="stat-card__body">
          <CountUp class="stat-card__value" :endVal="card.value" :options="countUpOptions"/>
          <p class="stat-card__label">{{ card.label }}</p>
        </div>
      </div>
    </section>

    <!-- 底部：最近文章 + 快捷操作/系统信息 -->
    <section class="bottom-grid">
      <div class="panel">
        <div class="panel__header">
          <span class="panel__title"><i class="iconfont icon-article"/> 最近更新文章</span>
          <span class="panel__link" @click="$router.push({name: 'BlogArticle'})">全部文章<i class="el-icon-arrow-right"/></span>
        </div>
        <div class="article-list">
          <div
            v-for="(article, index) in recentArticles"
            :key="article.id"
            class="article-item"
            @click="editArticle(article)">
            <span class="article-item__idx" :class="{'article-item__idx--top': index < 3}">{{ index + 1 }}</span>
            <span class="article-item__title">{{ article.title || "未命名文章" }}</span>
            <el-tag v-if="article.category" size="mini" effect="plain" class="article-item__tag">{{ article.category }}</el-tag>
            <span class="article-item__meta">
              <i class="iconfont icon-view"/>
              {{ article.view || 0 }}
            </span>
            <span class="article-item__time">{{ article.modifyTime | dateFormat("yyyy-MM-DD") }}</span>
          </div>
          <p v-if="recentArticles.length === 0" class="panel__empty">还没有发布过文章，点击右上角「去写文章」开始吧</p>
        </div>
      </div>
      <div class="side-col">
        <div class="panel">
          <div class="panel__header">
            <span class="panel__title"><i class="iconfont icon-zhedie"/> 快捷操作</span>
          </div>
          <div class="quick-grid">
            <div
              v-for="action in quickActions"
              :key="action.label"
              class="quick-item"
              @click="$router.push({name: action.routeName})">
              <i class="iconfont quick-item__icon" :class="action.icon" :style="{color: action.color, background: action.bg}"/>
              <span class="quick-item__label">{{ action.label }}</span>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel__header">
            <span class="panel__title"><i class="iconfont icon-setting"/> 系统信息</span>
          </div>
          <div class="sys-info">
            <div class="sys-info__row">
              <span class="sys-info__label">当前版本</span>
              <span>v2.2.2</span>
            </div>
            <div class="sys-info__row">
              <span class="sys-info__label">前端地址</span>
              <a href="http://re.lingjiatong.cn:30150" target="_blank">re.lingjiatong.cn</a>
            </div>
            <div class="sys-info__row">
              <span class="sys-info__label">github地址</span>
              <a href="https://github.com/ljtnono/re_admin" target="_blank">re_admin</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 系统监控 -->
    <section class="monitor-grid">
      <div class="panel">
        <div class="panel__header">
          <span class="panel__title"><i class="iconfont icon-monitor"/> 系统监控</span>
          <span class="live-badge"><span class="live-badge__dot"/>实时监控中</span>
        </div>
        <div class="gauge-wrap">
          <div ref="cpuGauge" class="gauge"/>
          <div ref="memGauge" class="gauge"/>
        </div>
        <div class="gauge-meta">
          <div class="gauge-meta__item">
            <span class="gauge-meta__label">CPU</span>
            <span>{{ cpuInfo.cpuCoreNum || "-" }} 核</span>
            <span class="gauge-meta__divider"/>
            <span>负载 {{ cpuInfo.loadAverage1 || "-" }} / {{ cpuInfo.loadAverage5 || "-" }} / {{ cpuInfo.loadAverage15 || "-" }}</span>
          </div>
          <div class="gauge-meta__item">
            <span class="gauge-meta__label">内存</span>
            <span>已用 {{ memInfo.usedMemory || "-" }}</span>
            <span class="gauge-meta__divider"/>
            <span>总计 {{ memInfo.totalMemory || "-" }}</span>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel__header">
          <span class="panel__title"><i class="iconfont icon-monitor"/> 磁盘 &amp; IO</span>
        </div>
        <div class="disk-list">
          <div v-for="disk in diskList" :key="disk.mountPoint" class="disk-item">
            <div class="disk-item__info">
              <span class="disk-item__mount">{{ disk.mountPoint }}</span>
              <span class="disk-item__size">{{ disk.usedSize }} / {{ disk.totalSize }}</span>
            </div>
            <el-progress
              :percentage="parsePercent(disk.usedPercent)"
              :stroke-width="8"
              :color="diskColor(parsePercent(disk.usedPercent))"/>
          </div>
          <p v-if="diskList.length === 0" class="panel__empty">暂无磁盘信息</p>
        </div>
        <div class="io-grid">
          <div class="io-item">
            <p class="io-item__label">磁盘读取</p>
            <p class="io-item__value">{{ ioInfo.diskReadRate || "-" }}</p>
          </div>
          <div class="io-item">
            <p class="io-item__label">磁盘写入</p>
            <p class="io-item__value">{{ ioInfo.diskWriteRate || "-" }}</p>
          </div>
          <div class="io-item">
            <p class="io-item__label">网络接收</p>
            <p class="io-item__value">{{ ioInfo.networkRecvRate || "-" }}</p>
          </div>
          <div class="io-item">
            <p class="io-item__label">网络发送</p>
            <p class="io-item__value">{{ ioInfo.networkSendRate || "-" }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 网络流量实时监控 -->
    <section class="panel io-panel">
      <div class="panel__header">
        <span class="panel__title"><i class="iconfont icon-icon-"/> 网络流量实时监控</span>
        <span class="live-badge"><span class="live-badge__dot"/>实时监控中</span>
      </div>
      <div ref="ioChart" class="io-chart"/>
    </section>

  </div>
</template>

<script>
import CountUp from "vue-countup-v2";
import {mapState} from "vuex";
import {findArticleList} from "@/api/article";
import {findCategoryList} from "@/api/category";
import {findTagList} from "@/api/tag";
import {findCommentPageList} from "@/api/comment";
import {findCPUInfo, findHardDiskInfo, findIOInfo, findMemoryInfo} from "@/api/systemMonitor";
import {ELEMENT_PAGE_LOADING_CONFIG} from "@/config/commonConfig";

export default {
  name: "Workspace",
  components: {
    CountUp
  },
  data() {
    return {
      // countUp配置
      countUpOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: "."
      },
      // 文章总数
      articleTotal: 0,
      // 总浏览量
      viewTotal: 0,
      // 总点赞数
      favoriteTotal: 0,
      // 评论总数
      commentTotal: 0,
      // 分类总数
      categoryTotal: 0,
      // 标签总数
      tagTotal: 0,
      // 最近更新文章列表
      recentArticles: [],
      // cpu信息
      cpuInfo: {},
      // 内存信息
      memInfo: {},
      // 磁盘信息列表
      diskList: [],
      // IO信息
      ioInfo: {},
      // cpu图表实例
      cpuChart: null,
      // 内存图表实例
      memChart: null,
      // 网络IO图表实例
      ioLineChart: null,
      // 网络IO时间轴（HH:mm:ss）
      ioTimeList: [],
      // 网络接收速率（KB/s）
      ioRecvList: [],
      // 网络发送速率（KB/s）
      ioSendList: [],
      // 监控轮询定时器
      monitorTimer: null,
      // 图表容器尺寸监听
      resizeObserver: null,
      // 窗口resize监听函数
      resizeHandler: null
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    // 登录用户名
    username() {
      return (this.userInfo && this.userInfo.username) || "博主";
    },
    // 根据当前时段生成问候语
    greeting() {
      let hour = new Date().getHours();
      if (hour >= 5 && hour < 9) {
        return "早上好";
      }
      if (hour >= 9 && hour < 11) {
        return "上午好";
      }
      if (hour >= 11 && hour < 13) {
        return "中午好";
      }
      if (hour >= 13 && hour < 18) {
        return "下午好";
      }
      if (hour >= 18 && hour < 23) {
        return "晚上好";
      }
      return "夜深了";
    },
    // 今天的日期和星期
    todayStr() {
      let weeks = ["日", "一", "二", "三", "四", "五", "六"];
      let now = new Date();
      return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weeks[now.getDay()]}`;
    },
    // 统计卡片配置
    statCards() {
      return [
        {label: "文章总数", value: Number(this.articleTotal) || 0, icon: "icon-article", color: "#409eff", bg: "#ecf5ff"},
        {label: "总浏览量", value: Number(this.viewTotal) || 0, icon: "icon-view", color: "#67c23a", bg: "#f0f9eb"},
        {label: "总点赞数", value: Number(this.favoriteTotal) || 0, icon: "icon-dianzan", color: "#f56c6c", bg: "#fef0f0"},
        {label: "评论总数", value: Number(this.commentTotal) || 0, icon: "icon-comment", color: "#e6a23c", bg: "#fdf6ec"},
        {label: "文章分类", value: Number(this.categoryTotal) || 0, icon: "icon-category", color: "#b37feb", bg: "#f9f0ff"},
        {label: "文章标签", value: Number(this.tagTotal) || 0, icon: "icon-biaoqian", color: "#13c2c2", bg: "#e6fffb"}
      ];
    },
    // 快捷操作配置
    quickActions() {
      return [
        {label: "写文章", routeName: "WriteArticle", icon: "icon-add", color: "#409eff", bg: "#ecf5ff"},
        {label: "文章管理", routeName: "BlogArticle", icon: "icon-article", color: "#67c23a", bg: "#f0f9eb"},
        {label: "分类管理", routeName: "BlogCategory", icon: "icon-category", color: "#b37feb", bg: "#f9f0ff"},
        {label: "评论管理", routeName: "BlogComment", icon: "icon-comment", color: "#e6a23c", bg: "#fdf6ec"}
      ];
    }
  },
  methods: {
    // 解析百分比字符串为数字
    parsePercent(str) {
      if (str == null || str === "-") {
        return 0;
      }
      let value = parseFloat(String(str).replace("%", ""));
      return isNaN(value) ? 0 : value;
    },
    // 解析速率字符串为KB/s数值
    rateToKB(str) {
      if (!str || str === "-") {
        return 0;
      }
      let s = String(str);
      let num = parseFloat(s);
      if (isNaN(num)) {
        return 0;
      }
      if (s.includes("GB/s")) {
        return num * 1024 * 1024;
      }
      if (s.includes("MB/s")) {
        return num * 1024;
      }
      if (s.includes("KB/s")) {
        return num;
      }
      if (s.includes("B/s")) {
        return num / 1024;
      }
      return num;
    },
    // 磁盘使用率对应进度条颜色
    diskColor(percent) {
      if (percent >= 90) {
        return "#f56c6c";
      }
      if (percent >= 70) {
        return "#e6a23c";
      }
      return "#409eff";
    },
    // 当前时间HH:mm:ss
    nowTime() {
      let now = new Date();
      let pad = n => String(n).padStart(2, "0");
      return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    },
    // 加载文章统计数据
    async loadArticleStats() {
      let res = await findArticleList({
        searchCondition: null,
        category: null,
        recommend: null,
        top: null,
        orderFieldList: null,
        orderFlagList: null,
        pageNum: 1,
        pageSize: 1000
      });
      let page = res.data.data || {};
      let records = page.records || [];
      this.articleTotal = page.total || 0;
      this.viewTotal = records.reduce((sum, item) => sum + (Number(item.view) || 0), 0);
      this.favoriteTotal = records.reduce((sum, item) => sum + (Number(item.favorite) || 0), 0);
      // 按最后更新时间倒序取前6篇
      this.recentArticles = records
        .slice()
        .sort((a, b) => String(b.modifyTime || "").localeCompare(String(a.modifyTime || "")))
        .slice(0, 6);
    },
    // 加载分类和标签数量
    async loadCategoryAndTag() {
      let [categoryRes, tagRes] = await Promise.all([findCategoryList(), findTagList()]);
      this.categoryTotal = (categoryRes.data.data || []).length;
      this.tagTotal = (tagRes.data.data || []).length;
    },
    // 加载评论数量
    async loadCommentTotal() {
      let res = await findCommentPageList({pageNum: 1, pageSize: 1, searchCondition: null});
      this.commentTotal = (res.data.data && res.data.data.total) || 0;
    },
    // 初始化cpu仪表盘
    initCpuChart() {
      this.cpuChart = this.$echarts.init(this.$refs.cpuGauge);
      this.cpuChart.setOption(this.buildGaugeOption(0, "CPU 使用率", "#409eff"));
    },
    // 初始化内存仪表盘
    initMemChart() {
      this.memChart = this.$echarts.init(this.$refs.memGauge);
      this.memChart.setOption(this.buildGaugeOption(0, "内存使用率", "#67c23a"));
    },
    // 生成仪表盘配置
    buildGaugeOption(value, name, color) {
      return {
        series: [{
          type: "gauge",
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 100,
          progress: {
            show: true,
            width: 10,
            roundCap: true,
            itemStyle: {color}
          },
          axisLine: {
            roundCap: true,
            lineStyle: {width: 10, color: [[1, "#ebeef5"]]}
          },
          axisTick: {show: false},
          splitLine: {show: false},
          axisLabel: {show: false},
          pointer: {show: false},
          anchor: {show: false},
          title: {
            show: true,
            offsetCenter: [0, "32%"],
            fontSize: 13,
            color: "#909399"
          },
          detail: {
            valueAnimation: true,
            formatter: "{value}%",
            fontSize: 30,
            fontWeight: 600,
            color: "#303133",
            offsetCenter: [0, "-5%"]
          },
          data: [{value, name}]
        }]
      };
    },
    // 初始化网络IO折线图
    initIoChart() {
      this.ioLineChart = this.$echarts.init(this.$refs.ioChart);
      this.ioLineChart.setOption({
        grid: {left: 60, right: 24, top: 40, bottom: 40},
        tooltip: {
          trigger: "axis",
          valueFormatter: value => (value == null ? "-" : value + " KB/s")
        },
        legend: {
          data: ["接收", "发送"],
          right: 12,
          top: 4,
          textStyle: {color: "#606266"}
        },
        xAxis: {
          type: "category",
          data: [],
          boundaryGap: false,
          axisLine: {lineStyle: {color: "#dcdfe6"}},
          axisLabel: {color: "#909399"}
        },
        yAxis: {
          type: "value",
          name: "KB/s",
          nameTextStyle: {color: "#909399"},
          splitLine: {lineStyle: {color: "#ebeef5"}},
          axisLabel: {color: "#909399"}
        },
        series: [
          {
            name: "接收",
            type: "line",
            smooth: true,
            symbol: "none",
            color: "#409eff",
            lineStyle: {width: 2},
            areaStyle: {opacity: 0.1},
            data: []
          },
          {
            name: "发送",
            type: "line",
            smooth: true,
            symbol: "none",
            color: "#67c23a",
            lineStyle: {width: 2},
            areaStyle: {opacity: 0.1},
            data: []
          }
        ]
      });
    },
    // 拉取一次系统监控数据并刷新图表
    async fetchMonitor() {
      try {
        let [cpuRes, memRes, diskRes, ioRes] = await Promise.all([
          findCPUInfo(),
          findMemoryInfo(),
          findHardDiskInfo(),
          findIOInfo()
        ]);
        this.cpuInfo = cpuRes.data.data || {};
        this.memInfo = memRes.data.data || {};
        this.diskList = diskRes.data.data || [];
        this.ioInfo = ioRes.data.data || {};

        if (this.cpuChart) {
          let cpuUsed = this.parsePercent(this.cpuInfo.userUsedPercent) + this.parsePercent(this.cpuInfo.systemUsedPercent);
          this.cpuChart.setOption({series: [{data: [{value: Math.round(cpuUsed * 10) / 10, name: "CPU 使用率"}]}]});
        }
        if (this.memChart) {
          this.memChart.setOption({series: [{data: [{value: this.parsePercent(this.memInfo.memoryUsedPercent), name: "内存使用率"}]}]});
        }
        if (this.ioLineChart) {
          this.ioTimeList.push(this.nowTime());
          this.ioRecvList.push(Math.round(this.rateToKB(this.ioInfo.networkRecvRate) * 10) / 10);
          this.ioSendList.push(Math.round(this.rateToKB(this.ioInfo.networkSendRate) * 10) / 10);
          // 最多保留60个采样点
          if (this.ioTimeList.length > 60) {
            this.ioTimeList.shift();
            this.ioRecvList.shift();
            this.ioSendList.shift();
          }
          this.ioLineChart.setOption({
            xAxis: {data: this.ioTimeList},
            series: [
              {data: this.ioRecvList},
              {data: this.ioSendList}
            ]
          });
        }
      } catch (e) {
        // 单次采样失败不打断轮询
        console.error("系统监控数据采样失败", e);
      }
    },
    // 跳转到写文章页面编辑该文章
    editArticle(article) {
      this.$router.push({name: "WriteArticle", query: {articleId: article.id}});
    }
  },
  async mounted() {
    let that = this;
    that.$loading(ELEMENT_PAGE_LOADING_CONFIG);
    try {
      await Promise.all([
        that.loadArticleStats(),
        that.loadCategoryAndTag(),
        that.loadCommentTotal()
      ]);
    } finally {
      that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
    }

    that.initCpuChart();
    that.initMemChart();
    that.initIoChart();
    // 先立即采样一次，之后每5秒轮询
    that.fetchMonitor();
    that.monitorTimer = setInterval(() => {
      that.fetchMonitor();
    }, 5000);

    that.resizeHandler = () => {
      [that.cpuChart, that.memChart, that.ioLineChart].forEach(chart => {
        if (chart) {
          chart.resize();
        }
      });
    };
    window.addEventListener("resize", that.resizeHandler);
    // 监听图表容器尺寸变化（如左侧导航展开/收起不触发window resize），自动重绘图表
    that.resizeObserver = new ResizeObserver(() => {
      [that.cpuChart, that.memChart, that.ioLineChart].forEach(chart => {
        if (chart) {
          chart.resize();
        }
      });
    });
    [that.$refs.cpuGauge, that.$refs.memGauge, that.$refs.ioChart].forEach(el => {
      if (el) {
        that.resizeObserver.observe(el);
      }
    });
  },
  beforeDestroy() {
    if (this.monitorTimer) {
      clearInterval(this.monitorTimer);
      this.monitorTimer = null;
    }
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    [this.cpuChart, this.memChart, this.ioLineChart].forEach(chart => {
      if (chart) {
        chart.dispose();
      }
    });
    this.cpuChart = null;
    this.memChart = null;
    this.ioLineChart = null;
  }
};
</script>

<style lang="scss" scoped>
// ========== 设计变量 ==========
$primary: #409eff;
$primary-light: #ecf5ff;
$text-primary: #303133;
$text-regular: #606266;
$text-secondary: #909399;
$text-placeholder: #c0c4cc;
$border-color: #ebeef5;
$border-light: #f2f6fc;
$panel-bg: #ffffff;
$page-bg: #f1f1f1;

.workspace {
  padding: 20px;
  background: $page-bg;
  box-sizing: border-box;
}

// ========== 欢迎横幅 ==========
.welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  border-radius: 10px;
  background: linear-gradient(120deg, #1c64d9 0%, #409eff 60%, #66b1ff 100%);
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.25);

  &__greeting {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
  }

  &__date {
    margin: 8px 0 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
  }

  &__write-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 40px;
    padding: 0 22px;
    font-size: 14px;
    color: $primary;
    background: #ffffff;
    border: none;
    border-radius: 20px;

    &:hover {
      color: darken($primary, 10%);
      background: #f5f9ff;
    }

    &:active {
      transform: scale(0.97);
    }
  }
}

// ========== 统计卡片 ==========
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: $panel-bg;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 10px;
    flex-shrink: 0;

    i {
      font-size: 24px;
    }
  }

  &__value {
    font-size: 26px;
    font-weight: 600;
    line-height: 1.2;
    color: $text-primary;
  }

  &__label {
    margin: 4px 0 0;
    font-size: 13px;
    color: $text-secondary;
  }
}

// ========== 面板通用 ==========
.panel {
  padding: 18px 20px;
  background: $panel-bg;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__title {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;

    i {
      color: $primary;
      font-size: 16px;
    }
  }

  &__link {
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    color: $primary;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &__empty {
    margin: 20px 0;
    font-size: 13px;
    color: $text-placeholder;
    text-align: center;
  }
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: $text-secondary;

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #67c23a;
    animation: live-breathe 2s ease-in-out infinite;
  }
}

@keyframes live-breathe {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.4);
  }
  50% {
    opacity: 0.6;
    box-shadow: 0 0 0 4px rgba(103, 194, 58, 0);
  }
}

// ========== 系统监控 ==========
.monitor-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.monitor-grid .panel {
  display: flex;
  flex-direction: column;
}

.io-panel {
  margin-top: 16px;
  margin-bottom: 24px;
}

.gauge-wrap {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-around;
  min-height: 240px;
}

.gauge {
  width: 280px;
  height: 240px;
}

.gauge-meta {
  display: flex;
  justify-content: space-around;
  margin-top: 4px;

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: $text-regular;
  }

  &__label {
    font-weight: 600;
    color: $text-primary;
  }

  &__divider {
    width: 1px;
    height: 12px;
    background: $border-color;
  }
}

.disk-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 40px;
}

.disk-item {
  &__info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    font-size: 13px;
    color: $text-regular;
  }

  &__mount {
    font-weight: 600;
    color: $text-primary;
  }
}

.io-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid $border-light;
}

.io-item {
  text-align: center;

  &__label {
    margin: 0;
    font-size: 12px;
    color: $text-secondary;
  }

  &__value {
    margin: 6px 0 0;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }
}

// ========== 网络流量 ==========
.io-chart {
  width: 100%;
  height: 280px;
}

// ========== 底部区域 ==========
.bottom-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 4px;
}

.article-list {
  display: flex;
  flex-direction: column;
}

.article-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f7f8fa;

    .article-item__title {
      color: $primary;
    }
  }

  & + & {
    border-top: 1px solid $border-light;
  }

  &__idx {
    width: 20px;
    font-size: 13px;
    font-weight: 600;
    color: $text-placeholder;
    text-align: center;
    flex-shrink: 0;

    &--top {
      color: #f56c6c;
    }
  }

  &__title {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    color: $text-primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s ease;
  }

  &__tag {
    flex-shrink: 0;
  }

  &__meta {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: $text-secondary;
    flex-shrink: 0;

    i {
      font-size: 14px;
    }
  }

  &__time {
    width: 90px;
    font-size: 13px;
    color: $text-placeholder;
    text-align: right;
    flex-shrink: 0;
  }
}

.side-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f7f8fa;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 20px;
    border-radius: 10px;
  }

  &__label {
    font-size: 13px;
    color: $text-regular;
  }
}

.sys-info {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__row {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: $text-regular;
  }

  &__label {
    width: 70px;
    color: $text-secondary;
    flex-shrink: 0;
  }

  a {
    color: $primary;

    &:hover {
      text-decoration: underline;
    }
  }
}

// ========== 响应式 ==========
@media (max-width: 1200px) {
  .monitor-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
