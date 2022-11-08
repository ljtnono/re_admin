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
        <el-card class="overview-card mr20" shadow="hover">
          <!-- 总文章数 -->
          <div class="overview-card-body-item fl">
            <div class="item-icon-container">
              <!-- TODO 换成其他ICON -->
              <i class="iconfont icon-comment"></i>
            </div>
          </div>
          <div class="overview-card-body-item fr">
            <div class="item-text-container">
              <p class="mt15 mb10">11111</p>
              <p>总文章数</p>
            </div>
          </div>
        </el-card>
        <el-card class="overview-card mr20" shadow="hover">
          <!-- 总文章数 -->
          <div class="overview-card-body-item fl">
            <div class="item-icon-container">
              <!-- TODO 换成其他ICON -->
              <i class="iconfont icon-comment"></i>
            </div>
          </div>
          <div class="overview-card-body-item fr">
            <div class="item-text-container">
              <p class="mt15 mb10">11111</p>
              <p>总文章数</p>
            </div>
          </div>
        </el-card>
        <el-card class="overview-card mr20" shadow="hover">
          <!-- 总文章数 -->
          <div class="overview-card-body-item fl">
            <div class="item-icon-container">
              <!-- TODO 换成其他ICON -->
              <i class="iconfont icon-comment"></i>
            </div>
          </div>
          <div class="overview-card-body-item fr">
            <div class="item-text-container">
              <p class="mt15 mb10">11111</p>
              <p>总文章数</p>
            </div>
          </div>
        </el-card>
        <el-card class="overview-card" shadow="hover">
          <!-- 总文章数 -->
          <div class="overview-card-body-item fl">
            <div class="item-icon-container">
              <!-- TODO 换成其他ICON -->
              <i class="iconfont icon-comment"></i>
            </div>
          </div>
          <div class="overview-card-body-item fr">
            <div class="item-text-container">
              <p class="mt15 mb10">11111</p>
              <p>总文章数</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 服务器监控曲线图 -->
    <div class="workspace-content mt50">
      <el-card>
        <template slot="header">
          服务器监控
        </template>
      </el-card>
    </div>
    <!-- 底部访问量曲线图 -->
    <div class="workspace-footer mt50">

    </div>
  </div>
</template>

<script>
export default {
  name: "Workspace",
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.workspace-container {
  height: 100%;
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
        min-width: 220px;
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
    height: 300px;
    background: #ffffff;
  }

  .workspace-footer {
    min-width: 1344px;
    width: 100%;
    height: 300px;
    background: #ffffff;
  }
}
</style>
