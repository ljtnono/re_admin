import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";
import qs from "qs";

// #################### 文章标签相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/user";

/**
 * 分页获取用户列表
 *
 * @param searchCondition 查询条件
 * @param pageNum 页数
 * @param pageSize 每页条数
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findUserList = ({searchCondition, pageNum, pageSize}) => {
  let param = qs.stringify({searchCondition, pageNum, pageSize});
  return axios.get(BASE_URL + requestMapping + "/list?" + param);
};
