// #################### 登录表单相关正则表达式 #################### //

// 校验用户名的正则表达式 用户名为4-20英文数字字符串
export const LOGIN_USERNAME_REGEX = /^[a-zA-Z0-9]{4,20}$/;
// 校验密码的正则表达式 密码必须包含大写字母和小写字母，然后特殊符号和数字其中的一种（特殊符号有，,。.+=[]），并且长度在8-20位之间
export const LOGIN_PASSWORD_REGEX = /^(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*[0-9，,。.+=[\]]+)[a-zA-Z0-9，,。.+=[\]]{6,20}$/;

// #################### 文章发布表单相关正则表达式 #################### //

// 文章标题正则表达式
export const ARTICLE_PUBLISH_TITLE_REGEX = /^[\u4e00-\u9fa5\S\s,.，。‘’“”'()（）]{4,100}$/;
// 文章简介的正则表达式
export const ARTICLE_PUBLISH_SUMMARY_REGEX = /^[\u4e00-\u9fa5\S\s,.，。‘’“”'()（）]{0,200}$/;
// 文章标签的正则表达式
export const ARTICLE_PUBLISH_TAG_REGEX = /^[\u4e00-\u9fa5\S]{2,20}$/;

// #################### 新增用户表单相关正则表达式 #################### //
// 用户名正则表达式
export const USER_ADD_USERNAME_REGEX = LOGIN_USERNAME_REGEX;
// 用户邮箱正则表达式
export const USER_ADD_EMAIL_REGEX = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
