// #################### 常用常量池 #################### //

// 页面基础访问url
// export const BASE_URL = "http://api.lingjiatong.cn:30152";
// export const BASE_URL = "http://127.0.0.1:8152";
export const BASE_URL = process.env.NODE_ENV === "production" ? "http://api.lingjiatong.cn:30152" : "http://127.0.0.1:8152";
export const WEBSOCKET_BASE_URL = process.env.NODE_ENV === "production" ? "ws://api.lingjiatong.cn:30152/api-backend/websocket" : "ws://127.0.0.1:8152/api-backend/websocket";
// 请求成功code值
export const HTTP_RESULT_SUCCESS_CODE = 0;
// 请求成功message值
export const HTTP_RESULT_SUCCESS_MESSAGE = "success";
// home页的路由名称
export const ROUT_HOME_NAME = "Home";
// 工作台页的路由名称
export const ROUT_WORKSPACE_NAME = "Workspace";
export const HTTP_TOKEN_HEADER_PREFIX = "Bearer ";
// 已删除
export const ENTITY_DELETE_STATE_DELETE = 1;
// 正常
export const ENTITY_DELETE_STATE_NORMAL = 0;
export const ENTITY_DELETE_VALUES = [ENTITY_DELETE_STATE_DELETE, ENTITY_DELETE_STATE_NORMAL];
// 推荐
export const ARTICLE_RECOMMEND = 1;
// 不推荐
export const ARTICLE_NOT_RECOMMEND = 0;
export const ARTICLE_RECOMMEND_VALUES = [ARTICLE_NOT_RECOMMEND, ARTICLE_RECOMMEND];
// 置顶
export const ARTICLE_TOP = 1;
// 不置顶
export const ARTICLE_NOT_TOP = 0;
export const ARTICLE_TOP_VALUES = [ARTICLE_NOT_TOP, ARTICLE_TOP];
// 原创
export const ARTICLE_CREATION_YC = 1;
// 转载
export const ARTICLE_CREATION_ZZ = 2;
export const ARTICLE_CREATION_TYPE_VALUES = [ARTICLE_CREATION_YC, ARTICLE_CREATION_ZZ];
// 图片封面最大大小
export const ARTICLE_COVER_SIZE_LIMIT = 2 * 1024 * 1024;
// 升序
export const ORDER_BY_ASC = 1;
// 降序
export const ORDER_BY_DESC = 2;


// #################### 相关方法 #################### //

// 取删除状态的反
export const getEntityStateContrary = (deleteStatus) => {
  return deleteStatus === ENTITY_DELETE_STATE_DELETE ? ENTITY_DELETE_STATE_NORMAL : ENTITY_DELETE_STATE_DELETE;
};
// 取推荐状态的反
export const getArticleRecommendContrary = (recommend) => {
  return recommend === ARTICLE_RECOMMEND ? ARTICLE_NOT_RECOMMEND : ARTICLE_RECOMMEND;
};
// 取置顶状态的反
export const getArticleTopContrary = (top) => {
  return top === ARTICLE_TOP ? ARTICLE_NOT_TOP : ARTICLE_TOP;
};
// 取排序的反
export const getOrderContrary = (order) => {
  return order === ORDER_BY_ASC ? ORDER_BY_DESC : ORDER_BY_ASC;
}
