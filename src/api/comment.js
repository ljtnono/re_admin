import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";
import qs from "qs";

// #################### 评论相关接口 #################### //

// url通用前缀
const requestMapping = "/api-backend/comment";

/**
 * 分页获取评论列表
 *
 * @param pageNum 页数
 * @param pageSize 每页条数
 * @param searchCondition 查询条件（匹配评论内容）
 * @returns {Promise<AxiosResponse<any>>}
 */
export const findCommentPageList = ({pageNum, pageSize, searchCondition}) => {
  let param = qs.stringify({pageNum, pageSize, searchCondition});
  return axios.get(BASE_URL + requestMapping + "/pageList?" + param);
};

/**
 * 批量删除评论
 *
 * @param commentIdSet 评论id集合
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteCommentBatch = (commentIdSet) => {
  return axios.delete(BASE_URL + requestMapping + "/deleteBatch", {
    data: {
      commentIdSet
    }
  });
};

/**
 * 更新评论状态（审核/置顶/折叠）
 *
 * @param commentIdSet 评论id集合
 * @param pending 是否待审核
 * @param pinned 是否置顶
 * @param collapsed 是否折叠
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateCommentStatus = ({commentIdSet, pending, pinned, collapsed}) => {
  return axios.put(BASE_URL + requestMapping + "/status", {
    commentIdSet,
    pending,
    pinned,
    collapsed
  });
};
