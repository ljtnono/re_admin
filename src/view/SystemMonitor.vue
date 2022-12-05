<template>
  <div class="system-monitor-container p20 flex flex1 flex-direction-column">
    <!-- cpu、内存概览信息 -->
    <div class="cpu-memory-overview-container flex flex-direction-row flex-justify-content-space-between">
      <el-card class="flex" shadow="hover">
        <template slot="header">
          <span>CPU</span>
        </template>
        <div class="card-body-container flex flex-direction-row flex-justify-content-space-between">
          <div class="text-item flex flex-direction-column">
            <span>16</span>
            <span>核心数</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>0.1%</span>
            <span>用户使用率</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>0.05%</span>
            <span>系统使用率</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>0.86%</span>
            <span>当前空闲率</span>
          </div>
        </div>
      </el-card>
      <el-card class="flex" shadow="hover">
        <template slot="header">
          <span>内存</span>
        </template>
        <div class="card-body-container flex flex-direction-row flex-justify-content-space-between">
          <div class="text-item flex flex-direction-column">
            <span>64GB</span>
            <span>总内存</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>36.58%</span>
            <span>已用内存</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>27.42%</span>
            <span>剩余内存</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>23.12%</span>
            <span>使用率</span>
          </div>
        </div>
      </el-card>
    </div>
    <!-- k8s集群信息 -->
    <div class="k8s-overview-container mt20">
      <el-card shadow="hover">
        <template slot="header">
          <span>k8s集群信息</span>
        </template>
        <div class="k8s-overview-body-container">
          <el-table
            :data="k8sFormData"
            max-height="600"
            stripe
            style="width: 100%">
            <el-table-column
              prop="date"
              label="NAME">
            </el-table-column>
            <el-table-column
              prop="date"
              label="READY">
            </el-table-column>
            <el-table-column
              prop="date"
              label="STATUS">
            </el-table-column>
            <el-table-column
              prop="date"
              label="RESTARTS">
            </el-table-column>
            <el-table-column
              prop="date"
              label="AGE">
            </el-table-column>
            <el-table-column
              prop="date"
              label="IP">
            </el-table-column>
            <el-table-column
              prop="date"
              label="NODE">
            </el-table-column>
            <el-table-column
              prop="date"
              label="NOMINATED NODE">
            </el-table-column>
            <el-table-column
              prop="date"
              label="READINESS GATES">
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <!-- 硬盘状态 -->
    <div class="hard-overview-container mt20">
      <el-card shadow="hover">
        <template slot="header">
          <span>硬盘状态</span>
        </template>
        <el-table
          stripe
          :data="hardFormData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="盘符路径">
          </el-table-column>
          <el-table-column
            prop="date"
            label="文件系统">
          </el-table-column>
          <el-table-column
            prop="date"
            label="总大小">
          </el-table-column>
          <el-table-column
            prop="date"
            label="可用大小">
          </el-table-column>
          <el-table-column
            prop="date"
            label="已用大小">
          </el-table-column>
          <el-table-column
            prop="date"
            label="已用百分比">
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "SystemMonitor",
  data() {
    return {
      k8sFormData: null,
      hardFormData: null
    }
  },
  methods: {

  },
  mounted() {

  }
};
</script>

<style lang="scss" scoped>
  .system-monitor-container {

    .cpu-memory-overview-container {

      .el-card {
        width: calc(50% - 10px);
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

    .k8s-overview-container {
      .el-card {
        margin: 0 auto;

        ::v-deep .el-card__header {
          border-bottom: none;
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
  }
</style>
