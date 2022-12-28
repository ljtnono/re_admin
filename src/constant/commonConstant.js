// #################### 常用常量池 #################### //

// 页面基础访问url
// export const BASE_URL = "http://api.lingjiatong.cn:30152/api-backend";
export const BASE_URL = process.env.NODE_ENV === "production" ? "http://api.lingjiatong.cn:30152/api-backend" : "http://127.0.0.1:8152/api-backend";
// 请求成功code值
export const HTTP_RESULT_SUCCESS_CODE = 0;
// 请求成功message值
export const HTTP_RESULT_SUCCESS_MESSAGE = "success";
// home页的路由名称
export const ROUT_HOME_NAME = "Home";
// 工作台页的路由名称
export const ROUT_WORKSPACE_NAME = "Workspace";
// 已删除
export const ENTITY_DELETE_STATE_DELETE = 1;
// 正常
export const ENTITY_DELETE_STATE_NORMAL = 0;
