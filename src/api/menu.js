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
 * 分页获取菜单列表
 *
 * @param searchCondition 查询条件
 * @param pageNum 页数
 * @param pageSize 每页条数
 * @param orderFieldList 排序字段列表
 * @param orderFlagList 排序字段排序方式列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findMenuList = ({searchCondition, pageNum, pageSize, orderFieldList, orderFlagList}) => {
  let param = qs.stringify({searchCondition, pageNum, pageSize, orderFieldList, orderFlagList});
  return axios.get(BASE_URL + requestMapping + "/list?" + param);
};
