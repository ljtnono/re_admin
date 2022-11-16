import axios from "axios";
import {
  HTTP_RESULT_SUCCESS_CODE,
  HTTP_RESULT_SUCCESS_MESSAGE,
} from "@/constant/commonConstant";
import ElementUI from "element-ui";
const instance = axios.create();

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    let code = response.data.code;
    let message = response.data.message;
    if (
      HTTP_RESULT_SUCCESS_CODE === code &&
      HTTP_RESULT_SUCCESS_MESSAGE === message
    ) {
      // 根据错误消息做一些特殊处理
      // TODO 捕获401、403、404、500等异常
      return response;
    } else {
      // TODO 弹出错误消息
      ElementUI.Message.error({
        message: message,
        type: "error",
        duration: 2000,
        center: false,
      });
    }
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // TODO 捕获401、403、404、500等异常
    return Promise.reject(error);
  }
);

export default instance;
