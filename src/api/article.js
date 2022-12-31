import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";

// #################### 草稿相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/article";

/**
 * 获取草稿列表
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getDraftList = () => {
  return axios.get(BASE_URL + requestMapping + "/draftList");
};

/**
 * 获取单个草稿内容
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getDraftDetail = (draftId) => {
  return axios.get(BASE_URL + requestMapping + "/draft/" + draftId);
};

/**
 * 保存或更新
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const saveOrUpdateDraft = (draftId, title, markdownContent) => {
  return axios.post(BASE_URL + requestMapping + "/saveOrUpdateDraft", {draftId, title, markdownContent});
};

/**
 * 删除草稿
 *
 * @param draftId 草稿id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteDraft = (draftId) => {
  return axios.delete(BASE_URL + requestMapping + "/deleteDraft/" + draftId);
};
