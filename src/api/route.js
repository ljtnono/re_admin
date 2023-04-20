import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";


// #################### 路由相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/route";

// .then(res => {
//   let data = res.data.data;
//   // 生成组件列表
//   data.forEach(route => {router.addRoute(dfsRouteList(route))});
// });

/**
 * 获取路由列表
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findRouteList = () => {
  return axios.get(BASE_URL + requestMapping + "/list");
}
