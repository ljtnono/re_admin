import axios from "axios";
import {
  HTTP_RESULT_SUCCESS_CODE, HTTP_RESULT_SUCCESS_MESSAGE,
} from "@/constant/commonConstant";
import ElementUI from "element-ui";

const instance = axios.create();
// 开发环境使用的token
const devToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjE2MzMzMzMzMzMzIiwidXNlcl9uYW1lIjoibGluZ2ppYXRvbmciLCJzY29wZSI6WyJhbGwiXSwiZXhwIjoxNjcyMTc1MTc4LCJ1c2VySWQiOjEsImF1dGhvcml0aWVzIjpbImJsb2ciXSwianRpIjoiZGFhYjE0NjMtZDc4ZS00OTkxLTk4OWMtY2JiMjA4NzJlY2RiIiwiZW1haWwiOiI5MzUxODg0MDBAcXEuY29tIiwiY2xpZW50X2lkIjoiY2xpZW50IiwidXNlcm5hbWUiOiJsaW5namlhdG9uZyJ9.mBgBZ77vnTSP_j-rBecKlFJj9dcSUJsWmoj3vmmm7pCVbZOZAw6jAWRUWSs6Iw3VPxjhKQPKQfY9WPImEb0KqEkrRMJ9fXCgXn1JdTilys0orWHF9M-8A47SdAbOMDZXsdQ08ld-8OMAx2EnzCuc55tKUl0NRwKFIOUOJu4unuNGBzL6XYFEtoGwIW6vDaHuNQZT0pC_snXx94050_75qD6UmZc9kL_D3UnK5l-lyizEygqdKyAZwmmJ6pDAgqUuWOKe-VXzcktw1ApuT2I81Tv2L7Dtu8ZLDeKNAm83qOfvsQ0LxPf2ErhvJL-IfsMKGfoEQiCtS-PTCYnMQ0sjjA";
// 添加请求拦截器
instance.interceptors.request.use(config => {
  if (process.env.NODE_ENV === "production") {
    let token = sessionStorage.getItem("tokenInfo");
    if(token) {
      //这里面获取的请求头的键(tokenHeader)根据每个后端的习惯封装的名称各不相同
      config.headers.common["Authorization"] = "Bearer " + JSON.parse(token).access_token;
    }
  } else {
    config.headers.common["Authorization"] = "Bearer " + devToken;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  let code = response.data.code;
  let message = response.data.message;
  if (HTTP_RESULT_SUCCESS_CODE === code && HTTP_RESULT_SUCCESS_MESSAGE === message) {
    return response;
  } else {
    // 弹出错误消息
    ElementUI.Message.error({
      message: message, type: "error", duration: 2000, center: false,
    });
    return;
  }
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // TODO 捕获401、403、404、500等异常
  return Promise.reject(error);
});

export default instance;
