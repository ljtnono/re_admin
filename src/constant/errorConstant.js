// 异常码MAP
const ERROR_MAP = new Map();
// token异常的错误码数组
const TOKEN_ERROR_CODE_ARRAY = [401, 401401, 401402, 401403, 401404, 401405, 400406, 401407, 401408, 401409];

//#################### 权限相关异常 ####################//
//#################### 没有携带token或者token异常 ####################//

// 未认证过的用户
ERROR_MAP.set(401, "未认证过的用户");
// token格式异常
ERROR_MAP.set(401401, "不支持的token格式");
// token已过期
ERROR_MAP.set(401402, "token已过期，请重新登录");
// 用户已下线，请重新登录
ERROR_MAP.set(401403, "用户已注销，请重新登录");
// 用户名或密码错误
ERROR_MAP.set(401404, "用户名或密码错误");
// 错误的scope值
ERROR_MAP.set(401405, "错误的scope值");
// 请输入grant_type的值
ERROR_MAP.set(400406, "请输入grant_type的值");
// 不支持的grant_type
ERROR_MAP.set(401407, "不支持的grant_type");
// client_id或client_secret错误
ERROR_MAP.set(401408, "client_id或client_secret错误");
// 缺少token参数或token格式异常
ERROR_MAP.set(401409, "缺少token参数或token格式异常");

//#################### 携带了token但是没有访问权限异常 ####################//

// 禁止访问
ERROR_MAP.set(403, "禁止访问");
// 无法修改其他用户信息
ERROR_MAP.set(403401, "无法修改其他用户信息");

export {
  ERROR_MAP,
  TOKEN_ERROR_CODE_ARRAY
}
