import axios from "axios";
import {
  HTTP_RESULT_SUCCESS_CODE,
  HTTP_RESULT_SUCCESS_MESSAGE,
  BASE_URL
} from "@/constant/commonConstant";
import ElementUI from "element-ui";
import urlUtil from "@/util/urlUtil";

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
    message: "操作失败！请检查网络", type: "error", duration: 2000, center: false,
  });
  return Promise.reject(error);
});

// 添加响应拦截器
INSTANCE.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  let contentType = response.headers["content-type"];
  if (contentType === "application/json") {
    let code = response.data.code;
    let message = response.data.message;
    if (HTTP_RESULT_SUCCESS_CODE === code && HTTP_RESULT_SUCCESS_MESSAGE === message) {
      return response;
    } else {
      // 弹出错误消息
      ElementUI.Message.error({
        message: message, type: "error", duration: 2000, center: false
      });
      return Promise.reject();
    }
  }
  return response;
}, error => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // TODO 捕获401、403、404、500等异常
  ElementUI.Message.error({
    message: "操作失败！请检查网络", type: "error", duration: 2000, center: false,
  });
  return Promise.reject(error);
});

export default INSTANCE;
