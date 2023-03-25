import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";
import qs from "qs";

// #################### 角色相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/role";

/**
 * 分页获取角色列表
 *
 * @param pageNum 页数
 * @param pageSize 每页条数
 * @param searchCondition 查询条件
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findRolePageList = ({searchCondition, pageNum, pageSize, orderFieldList, orderFlagList}) => {
  let param = qs.stringify({searchCondition, pageNum, pageSize, orderFieldList, orderFlagList});
  return axios.get(BASE_URL + requestMapping + "/pageList?" + param);
};

/**
 * 获取角色菜单树
 *
 * @param roleId 角色id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findRoleMenuTree = (roleId) => {
  return axios.get(BASE_URL + requestMapping + "/menuTree/" + roleId);
};
