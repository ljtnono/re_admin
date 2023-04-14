import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";
import qs from "qs";

// #################### 菜单相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/menu";

/**
 * 获取所有的菜单树
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findMenuTree = () => {
  return axios.get(BASE_URL + requestMapping + "/tree");
};


/**
 * 获取菜单列表
 *
 * @param searchCondition 查询条件
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findMenuList = (searchCondition) => {
  return axios.get(BASE_URL + requestMapping + "/list?searchCondition=" + searchCondition);
};
