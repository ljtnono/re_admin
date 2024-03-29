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
 * 获取角色列表
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findRoleList = () => {
  return axios.get(BASE_URL + requestMapping + "/list");
}

/**
 * 获取角色菜单树
 *
 * @param roleId 角色id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findRoleMenuTree = (roleId) => {
  return axios.get(BASE_URL + requestMapping + "/menuTree/" + roleId);
};

/**
 * 批量删除角色
 *
 * @param roleIdSet 角色id集合
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRoleBatch = (roleIdSet) => {
  return axios.delete(BASE_URL + requestMapping + "/deleteBatch", {
    data: {
      roleIdSet
    }
  });
};

/**
 * 新增角色
 *
 * @param name 角色名称
 * @description 角色描述
 * @param menuIdSet 角色对应的菜单id集合
 */
export const saveRole = ({name, description, menuIdSet}) => {
  return axios.post(BASE_URL + requestMapping, {
    name,
    description,
    menuIdSet
  });
};

/**
 * 编辑角色
 *
 * @param id 角色id
 * @param name 角色名称
 * @description 角色描述
 * @param menuIdSet 角色对应的菜单id集合
 */
export const updateRole = ({id, name, description, menuIdSet}) => {
  return axios.put(BASE_URL + requestMapping, {
    id,
    name,
    description,
    menuIdSet
  });
};


/**
 * 新增角色表单角色名称校验
 *
 * @param roleName 角色名称
 * @returns {Promise<AxiosResponse<any>>}
 */
export const addFormRoleNameCheck = (roleName) => {
  return axios.get(BASE_URL + requestMapping + "/addFormRoleNameCheck?roleName=" + roleName);
};

/**
 * 编辑角色表单角色名称校验
 * 
 * @param roleId 角色
 * @param roleName 角色名称
 * @returns {Promise<AxiosResponse<any>>)}
 */
export const editFormRoleNameCheck = (roleId, roleName) => {
  return axios.get(BASE_URL + requestMapping + "/editFormRoleNameCheck?roleId=" + roleId + "&roleName=" + roleName);
}

