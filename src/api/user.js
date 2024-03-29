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
  return axios.post(BASE_URL + requestMapping, {
    username,
    password,
    email,
    roleId
  })
};


/**
 * 测试用户名是否重复
 *
 * @param username 用户名
 * @returns {Promise<AxiosResponse<any>>}
 */
export const testUsernameDuplicate = (username) => {
  return axios.get(BASE_URL + requestMapping + "/testUsernameDuplicate?username=" + username);
};

/**
 * 测试邮箱是否重复
 *
 * @param email 邮箱
 * @returns {Promise<AxiosResponse<any>>}
 */
export const testEmailDuplicate = (email) => {
  return axios.get(BASE_URL + requestMapping + "/testEmailDuplicate?email=" + email);
};

/**
 * 管理员编辑用户表单测试邮箱是否可用接口
 *
 * @param email 邮箱
 * @param userId 用户id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const adminEditUserTestEmailAvailability = (email, userId) => {
  return axios.get(BASE_URL + requestMapping + "/adminEditUserTestEmailAvailability?email=" + email + "&userId=" + userId);
};

/**
 * 批量更新用户删除状态
 *
 * @param userIdList 用户id列表
 * @param deleteStatus 删除状态
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateUserDeleteStatusBatch = (userIdList, deleteStatus) => {
  return axios.put(BASE_URL + requestMapping + "/updateUserDeleteStatusBatch", {
    userIdList,
    deleteStatus
  })
};

/**
 * 批量删除用户
 *
 * @param userIdList 用户id列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteUserBatch = (userIdList) => {
  return axios.delete(BASE_URL + requestMapping + "/deleteUserBatch", {
    data: {
      userIdList
    }
  })
}

/**
 * 管理员用户编辑用户信息
 *
 * @param userId 用户id
 * @param password 用户密码
 * @param email 用户邮箱
 * @param roleId 角色id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const adminEditUser = (userId, password, email, roleId) => {
  return axios.put(BASE_URL + requestMapping + "/adminEditUser", {
    userId,
    password,
    email,
    roleId
  });
};
