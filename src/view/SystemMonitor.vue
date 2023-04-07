<template>
  <div class="system-monitor-container p20 flex flex1 flex-direction-column">
    <!-- cpu、内存概览信息 -->
    <div class="cpu-memory-overview-container flex flex-direction-row flex-justify-content-space-between">
      <el-card class="flex" shadow="hover">
        <template slot="header">
          <div class="flex flex-direction-row flex-justify-content-space-between">
            <span>CPU</span>
            <span>{{ cpuMonitorNode }}</span>
            <el-dropdown trigger="click" @command="changeCpuMonitorNode">
              <span>选择节点</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="node in k8sNodeList" :command="node" :key="node.nodeIPAddr">
                  {{ node.nodeHostname }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
            <span>{{ memoryMonitorNode }}</span>
            <el-dropdown trigger="click" @command="changeMemoryMonitorNode">
              <span>选择节点</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="node in k8sNodeList" :command="node" :key="node.nodeIPAddr">
                  {{ node.nodeHostname}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
    </div>
    <!-- k8s集群信息 -->
    <div class="k8s-overview-container mt20">
      <el-card shadow="hover">
        <template slot="header">
          <div class="flex flex-direction-row flex-justify-content-space-between">
            <span>k8s集群信息</span>
            <span>{{ k8sPodMonitorNamespace }}</span>
            <el-dropdown trigger="click" @command="changeK8sPodMonitorNamespace">
              <span>选择名称空间</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="namespace in k8sNamespaceList" :command="namespace" :key="namespace.name">
                  {{ namespace.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <div class="k8s-overview-body-container">
          <el-table
            :data="k8sPodList"
            max-height="600"
            stripe
            style="width: 100%">
            <el-table-column prop="name" label="NAME" />
            <el-table-column prop="ready" label="READY" />
            <el-table-column prop="status" label="STATUS" />
            <el-table-column prop="restarts" label="RESTARTS" />
            <el-table-column prop="age" label="AGE" />
            <el-table-column prop="ip" label="IP" />
            <el-table-column prop="node" label="NODE" />
            <el-table-column prop="nominatedNode" label="NOMINATED NODE" />
            <el-table-column prop="readinessGates" label="READINESS GATES" />
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
            <span>{{ hardDiskMonitorNode }}</span>
            <el-dropdown trigger="click" @command="changeHardDiskMonitorNode">
              <span>选择机器地址</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="node in k8sNodeList" :command="node" :key="node.nodeIPAddr">
                  {{ node.nodeHostname }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import { findK8sNamespaceList, findK8sNodeList } from "@/api/systemMonitor";
import "../mock/system"
import {
  HTTP_RESULT_SUCCESS_CODE,
  HTTP_RESULT_SUCCESS_MESSAGE,
  HTTP_TOKEN_HEADER_PREFIX,
  WEBSOCKET_BASE_URL
} from "@/constant/commonConstant";

export default {
  name: "SystemMonitor",
  data() {
    return {
      // cpu信息
      cpuInfo: {
        cpuCoreNum: null,
        userUsedPercent: null,
        systemUsedPercent: null,
        freePercent: null
      },
      // 当前监控的cpu节点
      cpuMonitorNode: null,
      // 内存信息
      memoryInfo: {
        totalMemory: null,
        usedMemory: null,
        availableMemory: null,
        memoryUsedPercent: null
      },
      // 当前监控的内存节点
      memoryMonitorNode: null,
      // 硬盘信息列表
      hardDiskInfoList: [],
      // 当前监控的硬盘信息节点
      hardDiskMonitorNode: null,
      // k8s pod列表
      k8sPodList: [],
      // k8s节点列表
      k8sNodeList: [],
      // k8s名称空间列表
      k8sNamespaceList: [],
      // 当前监控的k8s pod名称空间
      k8sPodMonitorNamespace: null,
      // websocket
      websocket: null,
      // 当前环境
      env: null,
      // 定时获取监控信息的定时器
      fetchTimer:null
    }
  },
  computed: {
    ...mapState({
      username: state => state.user.userInfo.username,
      token: state => HTTP_TOKEN_HEADER_PREFIX + state.user.tokenInfo.access_token
    })
  },
  methods: {
    // 更改当前监控的CPU节点
    changeCpuMonitorNode(node) {
      this.cpuMonitorNode = node.nodeHostname;
      this.findSystemInfo(node.nodeIPAddr, 1);
    },
    // 更改当前监控的内存节点
    changeMemoryMonitorNode(node) {
      this.memoryMonitorNode = node.nodeHostname;
      this.findSystemInfo(node.nodeIPAddr, 2);
    },
    // 更改当前监控的k8s pod的名称空间
    changeK8sPodMonitorNamespace(namespace) {
      this.k8sPodMonitorNamespace = namespace.name;
      this.findK8sPodInfo(namespace.name);
    },
    // 更改当前监控的硬盘节点
    changeHardDiskMonitorNode(node) {
      this.hardDiskMonitorNode = node.nodeHostname;
      this.findSystemInfo(node.nodeIPAddr, 4);
    },
    // 获取CPU、内存，硬盘信息
    findSystemInfo(ipAddr, type) {
      let message = {
        "messageTopic": "SYSTEM_MONITOR",
        "body": {
          "username": this.username,
          "type": type,
          "hostIPAddr": ipAddr
        }
      };
      this.websocket.send(JSON.stringify(message));
    },
    // 获取k8s集群的pod信息
    findK8sPodInfo(namespace) {
      let message = {
        "messageTopic": "SYSTEM_MONITOR",
        "body": {
          "username": this.username,
          "type": 3,
          "namespace": namespace
        }
      };
      this.websocket.send(JSON.stringify(message));
    },
    //初始化weosocket
    initWebSocket() {
      this.websocket.onmessage = this.websocketonmessage;
    },
    // 监听message事件
    websocketonmessage(e) {
      let outData = JSON.parse(e.data);
      let type = outData.type;
      let code = outData.resultVO.code;
      let message = outData.resultVO.message;
      let data = outData.resultVO.data;
      if (HTTP_RESULT_SUCCESS_CODE !== code || HTTP_RESULT_SUCCESS_MESSAGE !== message) {
        this.$message({
          type: "error",
          center: true,
          duration: 2000,
          message
        })
        return;
      }
      if (type === 1) {
        // cpu信息
        this.cpuInfo = data;
      } else if (type === 2) {
        this.memoryInfo = data;
      } else if (type === 3) {
        this.k8sPodList = data;
      } else {
        this.hardDiskInfoList = data;
      }
    },
    // 获取监控信息
    async fetchSystemMonitor() {
      // 获取k8s节点列表和名称空间列表
      await findK8sNamespaceList().then(res => {
        this.k8sNamespaceList = res.data.data;
      });
      await findK8sNodeList().then(res => {
        this.k8sNodeList = res.data.data;
      });
      let cpuMonitorNode = this.cpuMonitorNode;
      let memoryMonitorNode = this.memoryMonitorNode;
      let hardDiskMonitorNode = this.hardDiskMonitorNode;
      let k8sPodMonitorNamespace = this.k8sPodMonitorNamespace;
      if (this.env === "production") {
        // 生产环境
        if (cpuMonitorNode !== null) {
          this.cpuMonitorNode = cpuMonitorNode;
          let ipAddr = this.k8sNodeList.filter(node => cpuMonitorNode === node.nodeHostname)[0].nodeIPAddr;
          this.findSystemInfo(ipAddr, 1);
        } else {
          this.cpuMonitorNode = this.k8sNodeList[0].nodeHostname;
          this.findSystemInfo(this.k8sNodeList[0].nodeIPAddr, 1);
        }
        if (memoryMonitorNode !== null) {
          this.memoryMonitorNode = memoryMonitorNode;
          let ipAddr = this.k8sNodeList.filter(node => memoryMonitorNode === node.nodeHostname)[0].nodeIPAddr;
          this.findSystemInfo(ipAddr, 2);
        } else {
          this.memoryMonitorNode = this.k8sNodeList[0].nodeHostname;
          this.findSystemInfo(this.k8sNodeList[0].nodeIPAddr, 2);
        }
        if (hardDiskMonitorNode !== null) {
          this.hardDiskMonitorNode = hardDiskMonitorNode;
          let ipAddr = this.k8sNodeList.filter(node => hardDiskMonitorNode === node.nodeHostname)[0].nodeIPAddr;
          this.findSystemInfo(ipAddr, 4);
        } else {
          this.hardDiskMonitorNode = this.k8sNodeList[0].nodeHostname;
          this.findSystemInfo(this.k8sNodeList[0].nodeIPAddr, 4);
        }
        if (k8sPodMonitorNamespace !== null) {
          this.k8sPodMonitorNamespace = k8sPodMonitorNamespace;
          this.findK8sPodInfo(k8sPodMonitorNamespace);
        } else {
          this.k8sPodMonitorNamespace = this.k8sNamespaceList[0].name;
          this.findK8sPodInfo(this.k8sNamespaceList[0].name);
        }
      } else {
        // 开发环境
        this.findK8sPodInfo("rootelement");
        this.cpuMonitorNode = "k8s-master";
        this.memoryMonitorNode = "k8s-master";
        this.hardDiskMonitorNode = "k8s-master";
        this.k8sPodMonitorNamespace = "rootelement";
        this.findSystemInfo("www.lingjiatong.cn", 1);
        this.findSystemInfo("www.lingjiatong.cn", 2);
        this.findSystemInfo("www.lingjiatong.cn", 4);
      }
    },
  },
  async created() {
    this.env = process.env.NODE_ENV;
    this.websocket = new WebSocket(WEBSOCKET_BASE_URL + "?Authorization=" + this.token);
  },
  destroyed() {
    this.websocket.close();
    clearInterval(this.fetchTimer);
  },
  mounted() {
    this.initWebSocket();
    this.fetchTimer = setInterval(this.fetchSystemMonitor, 5000);
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
