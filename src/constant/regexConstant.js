// #################### 用户相关正则表达式 #################### //

// 校验用户名的正则表达式 用户名为4-20英文数字字符串
export const USERNAME_REGEX = /^[a-zA-Z0-9]{4,20}$/;
// 校验密码的正则表达式 密码必须包含大写字母和小写字母，然后特殊符号和数字其中的一种（特殊符号有，,。.+=[]），并且长度在8-20位之间
export const PASSWORD_REGEX = /^(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*[0-9，,。.+=[\]]+)[a-zA-Z0-9，,。.+=[\]]{6,20}$/;