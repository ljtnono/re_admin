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

/**
 * 获取面包屑导航
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findBreadcrumbList = () => {
  return axios.get(BASE_URL + requestMapping + "/breadcrumbList");
};

/**
 * 删除菜单
 * 
 * @param {Number} menuId 菜单id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteMenu = (menuId) => {
  return axios.delete(BASE_URL + requestMapping + "/" + menuId);
};

/**
 * 新增菜单
 * 
 * @param {String} title 
 * @param {String} routePath 
 * @param {Number} parentId 
 * @param {String} routeName 
 * @param {String} componentPath 
 * @param {String} icon 
 * @param {Array} permissionList 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const saveMenu = ({title, routePath, parentId, routeName, componentPath, icon, permissionList}) => {
  return axios.post(BASE_URL + requestMapping, {title, routePath, parentId, routeName, componentPath, icon, permissionList});
};

/**
 * 校验菜单路由名称是否重复
 * 
 * @param {String} routeName 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const checkMenuRouteNameDuplicate = (routeName) => {
  return axios.get(BASE_URL + requestMapping + "/checkRouteNameDuplicate?routeName=" + routeName);
};


/**
 * 校验菜单路由路径是否重复
 * 
 * @param {String} routeName 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const checkMenuRoutePathDuplicate = (routePath) => {
  return axios.get(BASE_URL + requestMapping + "/checkRoutePathDuplicate?routePath=" + routePath);
};