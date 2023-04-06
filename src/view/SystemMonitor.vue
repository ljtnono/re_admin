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
import { mapState } from "vuex";
import { findK8sNamespaceList, findK8sNodeList } from "../api/systemMonitor";
import "../mock/system"
import axios from "axios";
import SockJS from "sockjs-client";

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
  computed: {
    ...mapState({
      tokenInfo: state => state.user.tokenInfo
    })
  },
  methods: {
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
    },
  },
  async mounted() {
    // 获取k8s节点列表和名称空间列表
    await findK8sNamespaceList().then(res => {
      this.k8sNamespaceList = res.data.data;
    });
    await findK8sNodeList().then(res => {
      this.k8sNodeList = res.data.data;
    });

    const url = "ws://127.0.0.1:8152/api-backend/websocket";
    const token = this.$store.state.user.tokenInfo.access_token;
    const headers = {
      "Authorization": `Bearer ${token}`,
    };
    let socket = new SockJS(url, null, {
      headers: headers,
    });
    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };
    socket.onmessage = (event) => {
      console.log(`Received message: ${event.data}`);
      // 处理从服务器接收到的消息
    };
    socket.onclose = (event) => {
      console.log(`Disconnected from WebSocket: ${event.reason}`);
    };
  },
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
