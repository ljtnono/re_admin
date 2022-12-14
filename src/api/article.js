import axios from "@/config/axiosConfig";
import {BASE_URL} from "@/constant/commonConstant";
import qs from "qs";

// #################### 草稿相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/article";

/**
 * 获取草稿列表
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findDraftList = () => {
  return axios.get(BASE_URL + requestMapping + "/draftList");
};

/**
 * 获取单个草稿内容
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findDraftDetail = (draftId) => {
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


// #################### 文章相关接口 #################### //

/**
 * 文章发布
 *
 * @param draftId 草稿id
 * @param title 文章标题
 * @param markdownContent 文章内容
 * @param summary 文章简介
 * @param categoryId 文章分类
 * @param tagList 文章标签列表
 * @param recommend 是否推荐
 * @param top 是否置顶
 * @param creationType 原创类型
 * @param coverUrl 文章封面
 * @param transportInfo 转载说明
 * @param quoteInfo 文章引用信息
 * @returns {Promise<AxiosResponse<any>>}
 */
export const publishArticle = ({draftId, title, markdownContent, htmlContent, summary, categoryId, tagList, recommend, top, creationType, coverUrl, transportInfo, quoteInfo}) => {
  return axios.post(BASE_URL + requestMapping + "/publishArticle", {
    draftId,
    title,
    markdownContent,
    htmlContent,
    summary,
    categoryId,
    tagList,
    recommend,
    top,
    creationType,
    coverUrl,
    transportInfo,
    quoteInfo
  });
};

/**
 * 获取文章列表
 *
 * @param searchCondition 搜索条件
 * @param category 分页筛选条件
 * @param recommend 是否推荐
 * @param top 是否置顶
 * @param orderFieldList 排序字段列表
 * @param orderFlagList 排序标记列表
 * @param pageNum 请求页数
 * @param pageSize 每页条数
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findArticleList = ({searchCondition, category, recommend, top, orderFieldList, orderFlagList, pageNum, pageSize}) => {
  let param = qs.stringify({searchCondition, category, recommend, top, orderFieldList, orderFlagList, pageNum, pageSize});
  return axios.get(BASE_URL + requestMapping + "/list?" + param);
};


/**
 * 批量更新文章推荐状态
 *
 * @param articleIdList 文章id列表
 * @param recommend 推荐状态 1 推荐 0 不推荐
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateArticleRecommendBatch = (articleIdList, recommend) => {
  return axios.put(BASE_URL + requestMapping + "/updateArticleRecommendBatch", {
    articleIdList,
    recommend
  });
};

/**
 * 批量更新文章置顶状态
 *
 * @param articleIdList 文章id列表
 * @param top 置顶状态 1 置顶 0 不置顶
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateArticleTopBatch = (articleIdList, top) => {
  return axios.put(BASE_URL + requestMapping + "/updateArticleTopBatch", {
    articleIdList,
    top
  });
};

/**
 * 批量更新文章删除状态
 *
 * @param articleIdList 文章id列表
 * @param deleteStatus 删除状态 1 删除 0 正常
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateArticleDeleteBatch = (articleIdList, deleteStatus) => {
  return axios.put(BASE_URL + requestMapping + "/updateArticleDeleteBatch", {
    articleIdList,
    delete: deleteStatus
  });
};

/**
 * 批量删除文章
 *
 * @param articleIdList 文章id列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteArticleBatch = (articleIdList) => {
  return axios.delete(BASE_URL + requestMapping + "/deleteBatch", {
    data: {
      articleIdList
    }
  });
};
