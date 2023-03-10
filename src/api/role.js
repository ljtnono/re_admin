import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";

// #################### 角色相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/role";

/**
 * 获取角色列表
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findRoleList = () => {
  return axios.get(BASE_URL + requestMapping + "/list");
};
