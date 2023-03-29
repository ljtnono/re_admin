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

// #################### 新增用户表单相关错误消息 #################### //
export const USER_ADD_USERNAME_EMPTY_ERROR_MESSAGE = "用户名不能为空";
export const USER_ADD_USERNAME_FORMAT_ERROR_MESSAGE = "用户名为4-20位英文数字字符串";
export const USER_ADD_USERNAME_DUPLICATE_ERROR_MESSAGE = "用户名已存在";
export const USER_ADD_PASSWORD_EMPTY_ERROR_MESSAGE = "密码不能为空";
export const USER_ADD_PASSWORD_FORMAT_ERROR_MESSAGE = "密码必须包含大写字母和小写字母，然后特殊符号和数字其中的一种（，,。.+=[]），并且长度在8-20位之间";

export const USER_ADD_RE_PASSWORD_EMPTY_ERROR_MESSAGE = "请重新输入密码";
export const USER_ADD_RE_PASSWORD_ERROR_MESSAGE = "两次输入密码不一致";
export const USER_ADD_EMAIL_EMPTY_ERROR_MESSAGE = "邮箱不能为空";
export const USER_ADD_EMAIL_FORMAT_ERROR_MESSAGE = "邮箱格式错误";
export const USER_ADD_EMAIL_DUPLICATE_ERROR_MESSAGE = "邮箱已被其他帐号使用，请换一个邮箱";
export const USER_ADD_ROLE_EMPTY_ERROR_MESSAGE = "请选择角色";


// #################### 新增角色表单相关错误消息 #################### //

export const ROLE_ADD_NAME_EMPTY_ERROR_MESSAGE = "角色名称不能为空";
export const ROLE_ADD_NAME_FORMAT_ERROR_MESSAGE = "角色名为中文、英文和数字的字符串，长度为4-30个字符";
export const ROLE_ADD_NAME_DUPLICATE_ERROR_MESSAGE = "角色名已存在";

// #################### 管理员编辑用户表单相关错误消息 #################### //

export const ADMIN_USER_EDIT_PASSWORD_FORMAT_ERROR_MESSAGE = USER_ADD_PASSWORD_FORMAT_ERROR_MESSAGE;
export const ADMIN_USER_EDIT_ROLE_EMPTY_ERROR_MESSAGE = USER_ADD_ROLE_EMPTY_ERROR_MESSAGE;
export const ADMIN_USER_EDIT_EMAIL_EMPTY_ERROR_MESSAGE = USER_ADD_EMAIL_EMPTY_ERROR_MESSAGE;
export const ADMIN_USER_EDIT_EMAIL_FORMAT_ERROR_MESSAGE = USER_ADD_EMAIL_FORMAT_ERROR_MESSAGE;
export const ADMIN_USER_EDIT_EMAIL_AVAILABILITY_ERROR_MESSAGE = USER_ADD_EMAIL_DUPLICATE_ERROR_MESSAGE;
