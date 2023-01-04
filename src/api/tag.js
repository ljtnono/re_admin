import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";

// #################### 文章标签相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/tag";

/**
 * 获取标签列表
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findTagList = () => {
  return axios.get(BASE_URL + requestMapping + "/list");
};
