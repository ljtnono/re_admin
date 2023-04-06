import axios from "@/config/axiosConfig";

import { BASE_URL } from "@/constant/commonConstant";
import qs from "qs";

// #################### 角色相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/systemMonitor";


/**
 * 获取k8s集群节点列表
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findK8sNodeList = () => {
  return axios.get(BASE_URL + requestMapping + "/k8sNodeList");
};

/**
 * 获取k8s集群名称空间列表
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findK8sNamespaceList = () => {
  return axios.get(BASE_URL + requestMapping + "/k8sNamespaceList");
};
