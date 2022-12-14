// #################### 错误消息常量池 #################### //
// #################### 通用错误消息 #################### //
export const REQUEST_PARAM_ERROR = "请求参数有误";
export const ILLEGAL_PARAM_ERROR = "异常的参数值";
export const RESOURCE_NOT_EXIST_ERROR = "请求资源不存在";
export const PERMISSION_DENIED_ERROR = "禁止访问";
export const UNKNOWN_ERROR = "未知系统异常";

// #################### 登录表单相关错误消息 #################### //
export const LOGIN_USERNAME_EMPTY_ERROR_MESSAGE = "请输入用户名";
export const LOGIN_USERNAME_FORMAT_ERROR_MESSAGE = "用户名为4-20英文数字字符串";
export const LOGIN_PASSWORD_EMPTY_ERROR_MESSAGE = "请输入密码";
export const LOGIN_PASSWORD_FORMAT_ERROR_MESSAGE = "密码为大写字母和小写字母，数字和(，,。.+=[]）中的一种，并且长度在8-20位之间";
export const RE_PASSWORD_NOT_EQUALS_PASSWORD_ERROR_MESSAGE = "两次输入密码不一致";
export const LOGIN_VERIFY_CODE_EMPTY_ERROR_MESSAGE = "请输入验证码";

// #################### 文章发布表单相关错误消息 #################### //
export const ARTICLE_PUBLISH_TITLE_EMPTY_ERROR = "文章标题不能为空";
export const ARTICLE_PUBLISH_TITLE_FORMAT_ERROR = "文章标题为4-100个字符";
export const ARTICLE_PUBLISH_MARKDOWN_CONTENT_EMPTY_ERROR = "文章内容不能为空";
export const ARTICLE_PUBLISH_CATEGORY_EMPTY_ERROR = "请选择发布文章的类型";
export const ARTICLE_PUBLISH_SUMMARY_FORMAT_ERROR = "文章简介不能超过200个字符";
export const ARTICLE_PUBLISH_NO_TRANSPORT_INFO_ERROR_MESSAGE = "转载文章需附加转载说明";
export const ARTICLE_PUBLISH_TAG_NAME_FORMAT_ERROR_MESSAGE = "标签名为2-20个字符";
