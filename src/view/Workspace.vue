<template>
  <div class="workspace-container">
    <!-- 头部信息概览 -->
    <div class="workspace-header">
      <div class="system-info-container mr20">
        <el-card class="system-info-card" shadow="hover">
          <template slot="header">
            <span class="system-info-card-header">系统信息</span>
          </template>
          <div class="system-info-card-body-item mb10">
            <span>当前版本</span>
            <span>v2.2.2</span>
          </div>
          <div class="system-info-card-body-item mb10">
            <span>前端地址</span>
            <a href="http://re.lingjiatong.cn:30150" target="_blank">http://re.lingjiatong.cn:30150</a>
          </div>
          <div class="system-info-card-body-item">
            <span>github地址</span>
            <a href="https://github.com/ljtnono/re_admin" target="_blank">https://github.com/ljtnono/re_admin</a>
          </div>
        </el-card>
      </div>
      <!-- 系统博客相关概览信息 -->
      <div class="overview-container">
        <!-- 总文章数 -->
        <el-card class="overview-card mr20" shadow="hover">
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
        <!-- 总标签数 -->
        <el-card class="overview-card mr20" shadow="hover">
          <!-- 总文章数 -->
          <div class="overview-card-body-item fl">
            <div class="item-icon-container" style="background: #FF9900">
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
        <el-card class="overview-card mr20" shadow="hover">
          <!-- 总浏览量 -->
          <div class="overview-card-body-item fl">
            <div class="item-icon-container" style="background: #E46CBB">
              <i class="iconfont icon-icon-"></i>
            </div>
          </div>
          <div class="overview-card-body-item fr">
            <div class="item-text-container">
              <p> 100000</p>
              <p>总浏览量</p>
            </div>
          </div>
        </el-card>
        <!-- 总点赞数 -->
        <el-card class="overview-card" shadow="hover">
          <!-- 总点赞数 -->
          <div class="overview-card-body-item fl">
            <div class="item-icon-container" style="background: #349AD9">
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
          服务器监控
        </template>
        <div id="memory-line"></div>
        <div id="cpu-line"></div>
      </el-card>
    </div>
    <!-- 底部访问量曲线图 -->
    <div class="workspace-footer mt20">
      <el-card class="fl" shadow="hover">
        <template slot="header">
          流量监控
        </template>
        <div id="flow-line"></div>
      </el-card>
      <!-- 二维码 -->
      <div class="qrcode-container fr">
        <p>扫描二维码关注</p>
        <img src="http://www.lingjiatong.cn:30090/rootelement/sys/author_wx_qrcode.jpeg" alt="作者微信二维码">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Workspace",
  data() {
    return {}
  },
  methods: {
    // 内存曲线图
    drawMemoryLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("memory-line"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "系统内存消耗折线图",
          left: "40%",
          top: "5%",
          textStyle: {
            fontSize: 14
          }
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    // cpu曲线图
    drawCpuLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("cpu-line"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "系统cpu消耗折线图",
          textAlign: "left",
          left: "40%",
          top: "5%",
          textStyle: {
            fontSize: 14
          }
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    // 流量曲线图
    drawFlowLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("flow-line"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "访问流量折线图",
          left: "40%",
          top: "5%",
          textStyle: {
            fontSize: 14
          }
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  },
  mounted() {
    this.drawMemoryLine();
    this.drawCpuLine();
    this.drawFlowLine();
  }
}
</script>

<style lang="scss" scoped>
.workspace-container {
  height: calc(100% - 60px);
  margin: 20px auto;
  width: 1100px;

  .workspace-header {
    height: 145px;
    position: relative;

    .system-info-container {
      width: 320px;
      display: inline-block;
      position: absolute;
      left: 0;
      top: 0;

      .system-info-card {
        cursor: pointer;
        font-size: 14px;

        .system-info-card-body-item {
          span {
            display: inline-block;
            height: 20px;
            width: 80px;
          }

          a {
            color: #515A6E;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        ::v-deep .el-card__header {
          padding: 10px;
        }

        ::v-deep .el-card__body {
          padding: 10px;
        }
      }
    }

    .overview-container {
      display: inline-block;
      height: 145px;
      position: absolute;
      right: 0;
      top: 0;

      .el-card {
        padding: 16px 20px;
        border-radius: 4px;
        display: inline-block;
        width: 120px;
        height: 110px;
      }

      ::v-deep .el-card__body {
        cursor: pointer;
        font-size: 14px;
        height: 100%;
        padding: 0;

        .overview-card-body-item.fl {
          display: inline-block;
          height: 100%;
          width: 50px;

          .item-icon-container {
            height: 110px;
            background: #19BE6B;
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            text-align: center;
            vertical-align: center;

            i {
              line-height: 110px;
              font-size: 30px;
              color: #ffffff;
            }
          }
        }

        .overview-card-body-item.fr {
          display: inline-block;
          height: 100%;
          width: 70px;

          .item-text-container {
            text-align: center;
            color: #000000;
            background: #ffffff;
            position: relative;
            height: 100%;

            p:nth-child(1) {
              font-size: 16px;
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
              font-size: 12px;
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
      }

      #memory-line {
        height: 323px;
        width: 550px;
        position: absolute;
        left: 0;
        top: 0;
      }

      #cpu-line {
        height: 323px;
        width: 550px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }

  .workspace-footer {
    width: 100%;
    height: 300px;

    .el-card {
      cursor: pointer;
      height: 300px;
      width: 700px;

      ::v-deep .el-card__body {
        position: relative;
        height: calc(300px - 57px);
        width: 100%;
        padding: 0;
      }

      #flow-line {
        height: calc(300px - 57px);
        width: 100%;
        position: absolute;
        right: 0;
        top: 0;
      }
    }

    .qrcode-container {
      width: 300px;
      height: 300px;
      background: #ffffff;
      border-radius: 4px;
      cursor: pointer;
      transition: .3s;
      text-align: center;
      position: relative;
      &:hover {
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      }

      p {
        font-size: 18px;
        position: absolute;
        width: 140px;
        height: 40px;
        top: 10px;
        left: 80px;
        line-height: 40px;
      }

      img {
        display: block;
        width: 200px;
        height: 200px;
        margin: 0 auto;
        position: absolute;
        left: 50px;
        top: 60px;
      }
    }
  }
}
</style>
