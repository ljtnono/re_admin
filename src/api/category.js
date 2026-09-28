import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";

// #################### 分类相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/category";

/**
 * 获取文章分类列表
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findCategoryList = () => {
  return axios.get(BASE_URL + requestMapping + "/list");
};

/**
 * 新增文章分类
 *
 * @param name 分类名称
 * @returns {Promise<AxiosResponse<any>>}
 */
export const saveCategory = ({name}) => {
  return axios.post(BASE_URL + requestMapping + "/save", {
    name
  });
};

/**
 * 修改文章分类
 *
 * @param id 分类id
 * @param name 分类名称
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateCategory = ({id, name}) => {
  return axios.put(BASE_URL + requestMapping + "/update", {
    id,
    name
  });
};

/**
 * 批量删除文章分类
 *
 * @param categoryIdSet 分类id集合
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteCategoryBatch = (categoryIdSet) => {
  return axios.delete(BASE_URL + requestMapping + "/deleteBatch", {
    data: {
      categoryIdSet
    }
  });
};
