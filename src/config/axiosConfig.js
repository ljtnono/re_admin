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
import store from "@/store";

const INSTANCE = axios.create();
// 不需要携带token的请求路径集合
const PASS_TOKEN_URL = [
  BASE_URL + "/re-auth/user/login",
  BASE_URL + "/re-auth/user/refreshVerifyCode",
  BASE_URL + "/api-backend/route/list"
];

// 添加请求拦截器
INSTANCE.interceptors.request.use(config => {
  let urlWithoutParameter = urlUtil.removeParameter(config.url);
  if (!PASS_TOKEN_URL.includes(urlWithoutParameter)) {
    let token = store.state.user.tokenInfo;
    if (token) {
      config.headers["Authorization"] = "Bearer " + token["access_token"];
    }
  }
  return config;
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
      // 在这里处理自定义异常，这里处理完之后，如果调用axios时有自定义的catch也会进行处理
      // 弹出错误消息
      ElementUI.Message.error({
        message: message,
        duration: 2000,
        center: false
      });
      // 如果token异常，需要清除缓存，并跳转到登录页面
      if (TOKEN_ERROR_CODE_ARRAY.includes(code)) {
        // 删除当前token信息,并返回到登录界面
        store.commit("logout");
        router.push({
          name: "Login"
        });
      }
      return Promise.reject(response);
    }
  }
  return response;
}, error => {
  let message = error.message;
  if (message.indexOf("status code 503") !== -1) {
    // 这里处理HTTP非200的情况，这里处理完之后，如果axios有自定义的catch也会进行处理
    ElementUI.Message.error({
      message: "后台服务异常，请联系管理员！",
      duration: 2000,
      center: false
    });
  } else if (message.indexOf("Network Error") !== -1) {
    ElementUI.Message.error({
      message: "操作失败！请检查网络",
      duration: 2000,
      center: false
    });
  } else {
    console.log(error);
    ElementUI.Message.error({
      message: "未知异常",
      duration: 2000,
      center: false
    });
  }
});

export default INSTANCE;
