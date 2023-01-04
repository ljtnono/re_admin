import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";

// #################### 文章分类相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/category";

/**
 * 获取分类列表
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findCategoryList = () => {
  return axios.get(BASE_URL + requestMapping + "/list");
};

