import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";
import qs from "qs";

// #################### 用户相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/user";

/**
 * 分页获取用户列表
 *
 * @param searchCondition 查询条件
 * @param pageNum 页数
 * @param pageSize 每页条数
 * @param orderFieldList 排序字段列表
 * @param orderFlagList 排序标记列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findUserList = ({searchCondition, pageNum, pageSize, orderFieldList, orderFlagList}) => {
  let param = qs.stringify({searchCondition, pageNum, pageSize, orderFieldList, orderFlagList});
  return axios.get(BASE_URL + requestMapping + "/list?" + param);
};

/**
 * 新增用户
 *
 * @param username 用户名
 * @param password 用户密码
 * @param email 邮箱
 * @param roleId 角色id
 */
export const saveUser = ({username, password, email, roleId}) => {

};
