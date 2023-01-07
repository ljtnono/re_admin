import axios from "axios";
import {
  HTTP_RESULT_SUCCESS_CODE,
  HTTP_RESULT_SUCCESS_MESSAGE,
  BASE_URL
} from "@/constant/commonConstant";
import ElementUI from "element-ui";
import urlUtil from "@/util/urlUtil";
import {TOKEN_ERROR_CODE_ARRAY} from "@/constant/errorConstant";
import router from "../router";

const INSTANCE = axios.create();
// 不需要携带token的请求路径集合
const PASS_TOKEN_URL = [
  BASE_URL + "/re-auth/user/login",
  BASE_URL + "/re-auth/user/refreshVerifyCode"
];

// 添加请求拦截器
INSTANCE.interceptors.request.use(config => {
  let urlWithoutParameter = urlUtil.removeParameter(config.url);
  if (!PASS_TOKEN_URL.includes(urlWithoutParameter)) {
    let token = sessionStorage.getItem("tokenInfo");
    if(token) {
      config.headers["Authorization"] = "Bearer " + JSON.parse(token)["access_token"];
    }
  }
  return config;
}, error => {
  ElementUI.Message.error({
    message: "操作失败！请检查网络",
    duration: 2000,
    center: false
  });
  return Promise.reject(error);
});

// 添加响应拦截器
INSTANCE.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  let contentType = response.headers["content-type"];
  if (contentType.indexOf("application/json") !== -1) {
    let code = response.data.code;
    let message = response.data.message;
    if (HTTP_RESULT_SUCCESS_CODE === code && HTTP_RESULT_SUCCESS_MESSAGE === message) {
      return response;
    } else {
      // 弹出错误消息
      ElementUI.Message.error({
        message: message,
        duration: 2000,
        center: false
      });
      // 如果token异常，需要清除缓存，并跳转到登录页面
      if (TOKEN_ERROR_CODE_ARRAY.includes(code)) {
        sessionStorage.removeItem("userInfo");
        sessionStorage.removeItem("tokenInfo");
        sessionStorage.removeItem("menus");
        router.push({
          name: "Login"
        });
      }
      return Promise.reject();
    }
  }
  return response;
}, error => {
  ElementUI.Message.error({
    message: "操作失败！请检查网络",
    duration: 2000,
    center: false
  });
  return Promise.reject(error);
});

export default INSTANCE;
