import axios from "@/config/axiosConfig";

import { BASE_URL } from "@/constant/commonConstant";

// #################### 系统监控相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/systemMonitor";


/**
 * 获取本机cpu信息
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findCPUInfo = () => {
  return axios.get(BASE_URL + requestMapping + "/cpuInfo");
};

/**
 * 获取本机内存信息
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findMemoryInfo = () => {
  return axios.get(BASE_URL + requestMapping + "/memoryInfo");
};

/**
 * 获取本机硬盘信息
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findHardDiskInfo = () => {
  return axios.get(BASE_URL + requestMapping + "/hardDiskInfo");
};

/**
 * 获取本机磁盘、网络IO速率
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findIOInfo = () => {
  return axios.get(BASE_URL + requestMapping + "/ioInfo");
};
