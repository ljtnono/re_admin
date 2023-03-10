import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";
import qs from "qs";

// url通用前缀
const requestMapping = "/re-auth";

// #################### 用户相关接口 #################### //

/**
 * 刷新验证码
 *
 * @param verifyCodeKey
 * @returns {Promise<AxiosResponse<any>>}
 */
export const refreshVerifyCode = (verifyCodeKey) => {
  return axios.get(BASE_URL + requestMapping + "/user/refreshVerifyCode?verifyCodeKey=" + verifyCodeKey);
};

/**
 * 用户登录
 *
 * @param username 用户名
 * @param password 密码
 * @param verifyCodeKey 验证码key
 * @param verifyCode 验证码值
 * @returns {Promise<AxiosResponse<any>>}
 */
export const login = (username, password, verifyCodeKey, verifyCode) => {
  let data = {
    grant_type: "verify_code",
    client_id: "re_admin",
    client_secret: "re_admin",
    scope: "all",
    username: username,
    password: password,
    verifyCodeKey: verifyCodeKey,
    verifyCode: verifyCode
  };
  return axios.post(BASE_URL + requestMapping + "/user/login", qs.stringify(data), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

/**
 * 注销
 */
export const logout = () => {
  return axios.post(BASE_URL + requestMapping + "/user/logout");
};
