import Mock from "mockjs";
import {
  HTTP_RESULT_SUCCESS_CODE,
  HTTP_RESULT_SUCCESS_MESSAGE,
} from "@/constant/commonConstant";

// #################### 系统管理——用户管理接口 #################### //

// 获取用户列表参数
Mock.mock("/api-backend/system/user/list", "get", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  "data|10": [
    {
      id: "@increment(1)",
      username: "@word(4,20)",
      phone: /^1[3456789]\d{9}$/,
      email: "93188400@qq.com",
      avatarUrl: "@dataImage(180x120)",
      createTime: "@datetime()",
      modifyTime: "@datetime()",
      deleted: 0,
      roleIdList: [1, 2, 3],
    },
  ],
});

// #################### 系统管理——系统监控接口 #################### //

// 获取k8s集群节点列表
Mock.mock("/api-backend/system/monitor/k8sNodeList", "get", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  data: [
    {
      "hostname": "k8s-master",
      "ipAddress": "192.168.8.131"
    },
    {
      "hostname": "k8s-node1",
      "ipAddress": "192.168.8.132"
    }
  ]
});

// 获取k8s集群名称空间列表列表
Mock.mock("/api-backend/system/monitor/k8sNamespaceList", "get", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  data: ["kube-system", "rootelement"]
});


// 获取指定节点CPU信息
Mock.mock("/api-backend/system/monitor/CPUInfo", "get", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  data: {
    coreNum: 16,
    userUsagePercent: 0.2,
    systemUsagePercent: 0.03,
    freePercent: 0.27
  }
});

// 获取指定节点内存信息
Mock.mock("/api-backend/system/monitor/memoryInfo", "get", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  data: {
    total: 64,
    used: 25.44,
    freePercent: 0.03,
    usedPercent: 0.27
  }
});

// 获取指定名称空间pod列表
Mock.mock("/api-backend/system/monitor/k8sPodInfoList", "get", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  data: [
    {
      NAME: "api-backend-85997cff9d-528fn",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "1 (18d ago)",
      AGE: "23d",
      IP: "10.244.1.224",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "api-frontend-6d8d955c7d-nlcrx",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "2 (18d ago)",
      AGE: "23d",
      IP: "10.244.1.218",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "es-statefulset-0",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "2 (18d ago)",
      AGE: "77d",
      IP: "10.244.1.223",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "minio-statefulset-0",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "2 (18d ago)",
      AGE: "77d",
      IP: "10.244.1.228",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "mysql-statefulset-0",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "2 (18d ago)",
      AGE: "77d",
      IP: "10.244.1.232",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "nacos-statefulset-0",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "0",
      AGE: "6d22h",
      IP: "10.244.1.234",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "re-admin-deployment-6b55df75d7-92qg8",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "1 (18d ago)",
      AGE: "19d",
      IP: "10.244.1.225",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "re-auth-594b9d59c9-76jhh",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "1 (18d ago)",
      AGE: "23d",
      IP: "10.244.1.230",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "re-frontend-deployment-56479bf77-spkb8",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "1 (18d ago)",
      AGE: "23d",
      IP: "10.244.1.227",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "re-gateway-66dc895b87-ljjl5",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "1 (18d ago)",
      AGE: "23d",
      IP: "10.244.1.233",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "re-job-679689666b-cwh2t",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "1 (18d ago)",
      AGE: "23d",
      IP: "10.244.1.219",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "re-service-article-server-5c79775d44-q67md",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "1 (18d ago)",
      AGE: "23d",
      IP: "10.244.1.231",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "re-service-sys-server-549bf6d546-kzbj9",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "1 (18d ago)",
      AGE: "23d",
      IP: "10.244.1.226",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "redis-statefulset-0",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "2 (18d ago)",
      AGE: "56d",
      IP: "10.244.1.220",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    },
    {
      NAME: "xxl-job-admin-deployment-5bdc9df6fb-qwgp4",
      READY: "1/1",
      STATUS: "Running",
      RESTARTS: "2 (18d ago)",
      AGE: "51d",
      IP: "10.244.1.221",
      NODE: "k8s-node1",
      NOMINATED_NODE: "<none>",
      READINESS_GATES: "<none>"
    }
  ]
});

// 获取指定节点硬盘状态列表
Mock.mock("/api-backend/system/monitor/hardStatus", "get", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  data: [
    {
      path: "/dev/sda",
      fileSystem: "overlay",
      totalSize: 123,
      freeSize: 12.7,
      usedSize: 12.5,
      usedPercent: 12.6
    },
    {
      path: "/dev/sdb",
      fileSystem: "ext4",
      totalSize: 123,
      freeSize: 12.7,
      usedSize: 12.5,
      usedPercent: 12.6
    }
  ]
});
