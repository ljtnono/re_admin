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
              <p class="mt15 mb10">78</p>
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
              <p class="mt15 mb10">25</p>
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
              <p class="mt15 mb10">1000</p>
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
              <p class="mt15 mb10">200</p>
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
        <div id="memoryLine"></div>
        <div id="cpuLine"></div>
      </el-card>
    </div>
    <!-- 底部访问量曲线图 -->
    <div class="workspace-footer mt20">
      <el-card shadow="hover">
        <template slot="header">
          流量监控
        </template>
        <div></div>
      </el-card>
      <!-- 二维码 -->
      <div class="qrcode-container">
        <img src="" alt="">
        <img src="" alt="">
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
      let myChart = this.$echarts.init(document.getElementById("memoryLine"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "系统内存消耗柱状图",
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
      let myChart = this.$echarts.init(document.getElementById("cpuLine"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "系统cpu消耗柱状图",
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
    }
  },
  mounted() {
    this.drawMemoryLine();
    this.drawCpuLine();
  }
}
</script>

<style lang="scss" scoped>
.workspace-container {
  height: calc(100% - 60px);
  min-width: 1344px;
  padding: 20px 10px;
  margin: 0 auto;

  .workspace-header {
    min-width: 1344px;
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
        padding: 16px 24px;
        border-radius: 4px;
        display: inline-block;
      }

      ::v-deep .el-card__body {
        cursor: pointer;
        font-size: 14px;
        height: 110px;
        padding: 0;

        .overview-card-body-item {
          display: inline-block;
          height: 100%;

          .item-icon-container {
            width: 90px;
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


          &:nth-child(2) {
            .item-text-container {
              text-align: center;
              color: #000000;
              background: #ffffff;
              padding: 8px;

              p:nth-child(1) {
                font-size: 32px;
              }
            }
          }
        }
      }
    }
  }

  .workspace-content {
    min-width: 1344px;
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

      #memoryLine {
        height: 323px;
        width: 650px;
        position: absolute;
        left: 0;
        top: 0;
      }

      #cpuLine {
        height: 323px;
        width: 650px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }

  .workspace-footer {
    min-width: 1344px;
    width: 100%;
    height: 300px;

    .el-card {
      cursor: pointer;
      height: 340px;
      width: 960px;

      ::v-deep .el-card__body {
        position: relative;
        padding: 10px;
        height: calc(340px - 57px);
      }
    }
  }
}
</style>
