<template>
  <div class="workspace-container p20 flex flex1 flex-direction-column">
    <!-- 头部信息概览 -->
    <div class="workspace-header flex flex-direction-row">
      <div class="system-info-container flex mr20">
        <el-card class="system-info-card" shadow="hover">
          <template slot="header">
            <span class="system-info-card-header">系统信息</span>
          </template>
          <div class="system-info-card-body-item mb20">
            <span>当前版本</span>
            <span>v2.2.2</span>
          </div>
          <div class="system-info-card-body-item mb20">
            <span>前端地址</span>
            <a href="http://re.lingjiatong.cn:30150" target="_blank">
              http://re.lingjiatong.cn:30150
            </a>
          </div>
          <div class="system-info-card-body-item">
            <span>github地址</span>
            <a href="https://github.com/ljtnono/re_admin" target="_blank">
              https://github.com/ljtnono/re_admin
            </a>
          </div>
        </el-card>
      </div>
      <!-- 系统博客相关概览信息 -->
      <div class="overview-container flex flex1 flex-direction-row flex-justify-content-space-between">
        <!-- 总文章数 -->
        <el-card class="overview-card flex" shadow="hover">
          <div class="overview-card-body-item fl">
            <div class="item-icon-container">
              <i class="iconfont icon-article"></i>
            </div>
          </div>
          <div class="overview-card-body-item fr">
            <div class="item-text-container">
              <p>78</p>
              <p>总文章数</p>
            </div>
          </div>
        </el-card>
        <!-- 总分类数 -->
        <el-card class="overview-card flex" shadow="hover">
          <!-- 总点赞数 -->
          <div class="overview-card-body-item fl">
            <div class="item-icon-container" style="background: #f56c6c">
              <i class="iconfont icon-dianzan"></i>
            </div>
          </div>
          <div class="overview-card-body-item fr">
            <div class="item-text-container">
              <p>17</p>
              <p>总分类数</p>
            </div>
          </div>
        </el-card>
        <!-- 总标签数 -->
        <el-card class="overview-card flex" shadow="hover">
          <!-- 总文章数 -->
          <div class="overview-card-body-item fl">
            <div class="item-icon-container" style="background: #ff9900">
              <i class="iconfont icon-biaoqian"></i>
            </div>
          </div>
          <div class="overview-card-body-item fr">
            <div class="item-text-container">
              <p>25</p>
              <p>总标签数</p>
            </div>
          </div>
        </el-card>
        <!-- 总浏览量 -->
        <el-card class="overview-card flex" shadow="hover">
          <!-- 总浏览量 -->
          <div class="overview-card-body-item fl">
            <div class="item-icon-container" style="background: #e46cbb">
              <i class="iconfont icon-icon-"></i>
            </div>
          </div>
          <div class="overview-card-body-item fr">
            <div class="item-text-container">
              <p>100000</p>
              <p>总浏览量</p>
            </div>
          </div>
        </el-card>
        <!-- 总点赞数 -->
        <el-card class="overview-card flex" shadow="hover">
          <!-- 总点赞数 -->
          <div class="overview-card-body-item fl">
            <div class="item-icon-container" style="background: #349ad9">
              <i class="iconfont icon-dianzan"></i>
            </div>
          </div>
          <div class="overview-card-body-item fr">
            <div class="item-text-container">
              <p>200</p>
              <p>总点赞数</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 服务器监控曲线图 -->
    <div class="workspace-content mt20">
      <el-card shadow="hover">
        <template slot="header">
          <span>服务器监控</span>
        </template>
        <div class="flex flex-direction-row flex-justify-content-space-between">
          <div class="memory-line flex flex1"></div>
          <div class="cpu-line flex flex1"></div>
        </div>
      </el-card>
    </div>
    <!-- 底部访问量曲线图 -->
    <div class="workspace-footer mt20">
      <el-card shadow="hover">
        <template slot="header">
          <span>流量监控</span>
        </template>
        <div class="flow-line"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Workspace",
  data() {
    return {
      memoryLine: null,
      cpuLine: null,
      flowLine: null
    };
  },
  methods: {
    // 内存曲线图
    drawMemoryLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.querySelector(".memory-line"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "系统内存消耗折线图",
          left: "40%",
          top: "5%",
          textStyle: {
            fontSize: 14,
          },
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      this.memoryLine = myChart;
      window.addEventListener("resize", () => {
        // 第六步，执行echarts自带的resize方法，即可做到让echarts图表自适应
        myChart.resize();
      });
    },
    // cpu曲线图
    drawCpuLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.querySelector(".cpu-line"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "系统cpu消耗折线图",
          textAlign: "left",
          left: "40%",
          top: "5%",
          textStyle: {
            fontSize: 14,
          },
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      this.cpuLine = myChart;
      window.addEventListener("resize", () => {
        // 第六步，执行echarts自带的resize方法，即可做到让echarts图表自适应
        myChart.resize();
      });
    },
    // 流量曲线图
    drawFlowLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.querySelector(".flow-line"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "访问流量折线图",
          left: "40%",
          top: "5%",
          textStyle: {
            fontSize: 14,
          },
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      this.flowLine = myChart;
      window.addEventListener("resize", () => {
        // 第六步，执行echarts自带的resize方法，即可做到让echarts图表自适应
        myChart.resize();
      });
    },
  },
  mounted() {
    this.drawMemoryLine();
    this.drawCpuLine();
    this.drawFlowLine();
  },
  beforeDestroy() {
    /* 页面组件销毁的时候，别忘了移除绑定的监听resize事件，否则的话，多渲染几次
    容易导致内存泄漏和额外CPU或GPU占用哦*/
    window.removeEventListener("resize", () => {
      this.cpuLine.resize();
      this.memoryLine.resize();
      this.flowLine.resize();
    });
  },
};
</script>

<style lang="scss" scoped>
.workspace-container {

  .workspace-header {
    position: relative;
    height: 200px;

    .system-info-container {
      height: 100%;

      .system-info-card {
        cursor: pointer;
        font-size: 14px;
        width: 400px;

        .system-info-card-body-item {
          span {
            display: inline-block;
            height: 20px;
            width: 80px;
          }

          a {
            color: #515a6e;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }

    .overview-container {
      height: 100%;

      .overview-card {
        padding: 16px 20px;
        border-radius: 4px;
        display: inline-block;

        ::v-deep .el-card__body {
          cursor: pointer;
          font-size: 14px;
          height: 100%;
          padding: 0;
          width: 200px;

          .overview-card-body-item.fl {
            display: inline-block;
            height: 100%;
            width: 100px;

            .item-icon-container {
              height: 100%;
              background: #19be6b;
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
              text-align: center;
              line-height: 166px;

              i {
                font-size: 40px;
                color: #ffffff;
              }
            }
          }

          .overview-card-body-item.fr {
            display: inline-block;
            height: 100%;
            width: 100px;

            .item-text-container {
              text-align: center;
              color: #000000;
              background: #ffffff;
              position: relative;
              height: 100%;

              p:nth-child(1) {
                font-size: 20px;
                display: block;
                width: 100%;
                height: 32px;
                position: absolute;
                left: 0;
                top: calc(30% - 16px);
                line-height: 32px;
                text-align: center;
              }

              p:nth-child(2) {
                text-align: center;
                font-size: 14px;
                display: block;
                height: 18px;
                width: 100%;
                position: absolute;
                left: 0;
                line-height: 18px;
                top: calc(70% - 9px);
              }
            }
          }
        }
      }
    }
  }

  .workspace-content {
    width: 100%;
    height: 400px;

    .el-card {
      cursor: pointer;
      height: 400px;

      ::v-deep .el-card__body {
        position: relative;
        padding: 10px;
        height: 343px;

        .memory-line {
          height: 323px;
        }

        .cpu-line {
          height: 323px;
        }
      }
    }
  }

  .workspace-footer {
    width: 100%;
    height: 400px;

    .el-card {
      cursor: pointer;
      height: 400px;

      ::v-deep .el-card__body {
        position: relative;
        padding: 10px;

        .flow-line {
          height: calc(400px - 77px);
          width: 100%;
        }
      }
    }
  }
}
</style>
