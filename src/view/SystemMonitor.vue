<template>
  <div class="system-monitor-container p20 flex flex1 flex-direction-column">
    <!-- cpu、内存概览信息 -->
    <div class="cpu-memory-overview-container flex flex-direction-row flex-justify-content-space-between">
      <el-card class="flex" shadow="hover">
        <template slot="header">
          <div class="flex flex-direction-row flex-justify-content-space-between">
            <span>CPU</span>
            <span>{{ cpuMonitorNode }}</span>
            <el-dropdown trigger="click" @command="changeCPUMonitorIP">
              <span>选择节点</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="node in k8sNodeList" :command="node" :key="node.hostname">
                  {{ node.hostname }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <div class="card-body-container flex flex-direction-row flex-justify-content-space-between">
          <div class="text-item flex flex-direction-column">
            <span>{{ cpuMonitorInfo.coreNum }}</span>
            <span>核心数</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ cpuMonitorInfo.userUsagePercent * 100 }}%</span>
            <span>用户使用率</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ cpuMonitorInfo.systemUsagePercent * 100 }}%</span>
            <span>系统使用率</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ cpuMonitorInfo.freePercent * 100 }}%</span>
            <span>当前空闲率</span>
          </div>
        </div>
      </el-card>
      <el-card class="flex" shadow="hover">
        <template slot="header">
          <div class="flex flex-direction-row flex-justify-content-space-between">
            <span>内存</span>
            <span>{{ memoryMonitorNode }}</span>
            <el-dropdown trigger="click" @command="changeMemoryMonitorIP">
              <span>选择节点</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="node in k8sNodeList" :command="node" :key="node.hostname">
                  {{ node.hostname }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <div class="card-body-container flex flex-direction-row flex-justify-content-space-between">
          <div class="text-item flex flex-direction-column">
            <span>{{ memoryMonitorInfo.total }}GB</span>
            <span>总内存</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ memoryMonitorInfo.used }}GB</span>
            <span>已用内存</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ memoryMonitorInfo.free }}GB</span>
            <span>剩余内存</span>
          </div>
          <div class="text-item flex flex-direction-column">
            <span>{{ memoryMonitorInfo.usedPercent * 100 }}%</span>
            <span>使用率</span>
          </div>
        </div>
      </el-card>
    </div>
    <!-- k8s集群信息 -->
    <div class="k8s-overview-container mt20">
      <el-card shadow="hover">
        <template slot="header">
          <div class="flex flex-direction-row flex-justify-content-space-between">
            <span>k8s集群信息</span>
            <span>{{ k8sMonitorNamespace }}</span>
            <el-dropdown trigger="click" @command="changeK8sPodMonitorNamespace">
              <span>选择名称空间</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="namespace in k8sNamespaceList" :command="namespace" :key="namespace">
                  {{ namespace }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <div class="k8s-overview-body-container">
          <el-table
            :data="k8sPodInfoList"
            max-height="600"
            stripe
            style="width: 100%">
            <el-table-column
              prop="NAME"
              label="NAME">
            </el-table-column>
            <el-table-column
              prop="READY"
              label="READY">
            </el-table-column>
            <el-table-column
              prop="STATUS"
              label="STATUS">
            </el-table-column>
            <el-table-column
              prop="RESTARTS"
              label="RESTARTS">
            </el-table-column>
            <el-table-column
              prop="AGE"
              label="AGE">
            </el-table-column>
            <el-table-column
              prop="IP"
              label="IP">
            </el-table-column>
            <el-table-column
              prop="NODE"
              label="NODE">
            </el-table-column>
            <el-table-column
              prop="NOMINATED_NODE"
              label="NOMINATED NODE">
            </el-table-column>
            <el-table-column
              prop="READINESS_GATES"
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
          <div class="flex flex-direction-row flex-justify-content-space-between">
            <span>硬盘状态</span>
            <span>{{ hardStatusMonitorNode }}</span>
            <el-dropdown trigger="click" @command="changeHardStatusMonitorIP">
              <span>选择机器地址</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="node in k8sNodeList" :command="node" :key="node.hostname">
                  {{ node.hostname }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <el-table
          stripe
          :data="hardStatusList"
          style="width: 100%">
          <el-table-column
            prop="path"
            label="盘符路径">
          </el-table-column>
          <el-table-column
            prop="fileSystem"
            label="文件系统">
          </el-table-column>
          <el-table-column
            prop="totalSize"
            label="总大小">
          </el-table-column>
          <el-table-column
            prop="freeSize"
            label="可用大小">
          </el-table-column>
          <el-table-column
            prop="usedSize"
            label="已用大小">
          </el-table-column>
          <el-table-column
            prop="usedPercent"
            label="已用百分比">
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import "../mock/system"

export default {
  name: "SystemMonitor",
  data() {
    return {
      cpuMonitorNode: null,
      memoryMonitorNode: null,
      k8sMonitorNamespace: null,
      hardStatusMonitorNode: null,
      cpuMonitorInfo: {
        coreNum: null,
        userUsagePercent: null,
        systemUsagePercent: null,
        freePercent: null
      },
      memoryMonitorInfo: {
        total: null,
        used: null,
        free: null,
        usedPercent: null
      },
      k8sNodeList: [],
      k8sNamespaceList: [],
      k8sPodInfoList: [],
      hardStatusList: []
    }
  },
  methods: {
    // 获取k8s节点列表
    getK8sNodeList() {
      this.$http.get("/api-backend/system/monitor/k8sNodeList").then(res => {
        let data = res.data.data;
        let defaultSelect = data[0].hostname + "\t" + data[0].ipAddress;
        this.k8sNodeList = data;
        this.cpuMonitorNode = defaultSelect;
        this.memoryMonitorNode = defaultSelect;
        this.hardStatusMonitorNode = defaultSelect;
      });
    },
    // 获取cpu监控信息
    getCPUInfo(node) {
      this.$http.get("/api-backend/system/monitor/CPUInfo").then(res => {
        let data = res.data.data;
        this.cpuMonitorInfo = data;
        if (node !== null && node !== undefined) {
          this.cpuMonitorNode = node.hostname + "\t" + node.ipAddress;
        }
      });
    },
    // 获取内存监控信息
    getMemoryInfo(node) {
      this.$http.get("/api-backend/system/monitor/memoryInfo").then(res => {
        let data = res.data.data;
        this.memoryMonitorInfo = data;
        if (node !== null && node !== undefined) {
          this.memoryMonitorNode = node.hostname + "\t" + node.ipAddress;
        }
      });
    },
    // 获取k8s名称空间列表
    getK8sNamespaceList(namespace) {
      this.$http.get("/api-backend/system/monitor/k8sNamespaceList").then(res => {
        let data = res.data.data;
        this.k8sNamespaceList = data;
        if (namespace === null || namespace === undefined) {
          this.k8sMonitorNamespace = data[1];
        } else {
          this.k8sMonitorNamespace = namespace;
        }
      });
    },
    // 获取指定名称空间的pod状态信息
    getK8sPodInfoList(namespace) {
      this.$http.get("/api-backend/system/monitor/k8sPodInfoList").then(res => {
        let data = res.data.data;
        this.k8sPodInfoList = data;
      });
    },
    // 获取指定机器的硬盘状态
    getHardStatus(node) {
      this.$http.get("/api-backend/system/monitor/hardStatus").then(res => {
        let data = res.data.data;
        this.hardStatusList = data;
        if (node === null || node === undefined) {
          this.hardStatusMonitorNode = this.k8sNodeList[0].hostname + "\t" + this.k8sNodeList[0].ipAddress;
        } else {
          this.hardStatusMonitorNode = node.hostname + "\t" + node.ipAddress;
        }
      });
    },
    changeCPUMonitorIP(node) {
      this.getCPUInfo(node);
    },
    changeMemoryMonitorIP(node) {
      this.getMemoryInfo(node);
    },
    changeK8sPodMonitorNamespace(namespace) {
      this.getK8sNamespaceList(namespace);
    },
    changeHardStatusMonitorIP(node) {
      this.getHardStatus(node);
    }
  },
  mounted() {
    this.getK8sNodeList();
    this.getCPUInfo();
    this.getMemoryInfo();
    this.getK8sNamespaceList(null);
    this.getK8sPodInfoList(this.k8sMonitorNamespace);
    this.getHardStatus(null);
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
