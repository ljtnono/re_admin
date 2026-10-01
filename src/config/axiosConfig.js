import axios from "axios";
import { ElMessage } from "element-plus";
import urlUtil from "@/util/urlUtil";
import router from "@/router";
import { useUserStore } from "@/store/user";
import globalLogout from "@/util/storeUtil";
import { TOKEN_ERROR_CODE_ARRAY } from "@/constant/errorConstant";
import {
  HTTP_RESULT_SUCCESS_CODE,
  HTTP_RESULT_SUCCESS_MESSAGE,
  BASE_URL
} from "@/constant/commonConstant";

const INSTANCE = axios.create();
// 不需要携带token的请求路径集合
const PASS_TOKEN_URL = [
  BASE_URL + "/re-auth/user/login",
  BASE_URL + "/re-auth/user/refreshVerifyCode"
];

// 添加请求拦截器
INSTANCE.interceptors.request.use((config) => {
  const urlWithoutParameter = urlUtil.removeParameter(config.url);
  if (!PASS_TOKEN_URL.includes(urlWithoutParameter)) {
    const token = useUserStore().tokenInfo;
    if (token) {
      config.headers["Authorization"] = "Bearer " + token["access_token"];
    }
  }
  return config;
});

// 添加响应拦截器
INSTANCE.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  const contentType = response.headers && response.headers["content-type"];
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const code = response.data.code;
    const message = response.data.message;
    if (HTTP_RESULT_SUCCESS_CODE === code && HTTP_RESULT_SUCCESS_MESSAGE === message) {
      return response;
    } else {
      // 弹出错误消息（调用处的自定义catch仍会执行）
      ElMessage.error({
        message: message,
        duration: 2000,
        center: false
      });
      // 如果token异常，需要清除缓存，并跳转到登录页面
      if (TOKEN_ERROR_CODE_ARRAY.includes(code)) {
        globalLogout();
        router.push({
          name: "Login"
        });
      }
      return Promise.reject(response);
    }
  }
  return response;
}, (error) => {
  const message = error.message || "";
  // HTTP 401：未认证或登录状态失效，强制登出并跳转登录页
  if (error.response && error.response.status === 401) {
    if (router.currentRoute.value.name !== "Login") {
      ElMessage.error({
        message: "登录状态已失效，请重新登录",
        duration: 2000,
        center: false
      });
      globalLogout();
      router.push({
        name: "Login"
      });
    }
    return Promise.reject(error);
  }
  if (message.indexOf("status code 503") !== -1) {
    ElMessage.error({
      message: "后台服务异常，请联系管理员！",
      duration: 2000,
      center: false
    });
  } else if (message.indexOf("Network Error") !== -1) {
    ElMessage.error({
      message: "操作失败！请检查网络",
      duration: 2000,
      center: false
    });
  } else {
    console.log(error);
    ElMessage.error({
      message: "未知异常",
      duration: 2000,
      center: false
    });
  }
  return Promise.reject(error);
});

export default INSTANCE;
