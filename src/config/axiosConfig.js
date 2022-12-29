import axios from "axios";
import {
  HTTP_RESULT_SUCCESS_CODE, HTTP_RESULT_SUCCESS_MESSAGE,
} from "@/constant/commonConstant";
import ElementUI from "element-ui";

const instance = axios.create();
// 开发环境使用的token
const devToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjE2MzMzMzMzMzMzIiwidXNlcl9uYW1lIjoibGluZ2ppYXRvbmciLCJzY29wZSI6WyJhbGwiXSwiZXhwIjoxNjcyMzQxODc4LCJ1c2VySWQiOjEsImF1dGhvcml0aWVzIjpbImJsb2ciXSwianRpIjoiMjE3M2ZjNjEtMDA0YS00NTM0LWJiYjktYjY4ZTFhODJmN2JmIiwiZW1haWwiOiI5MzUxODg0MDBAcXEuY29tIiwiY2xpZW50X2lkIjoiY2xpZW50IiwidXNlcm5hbWUiOiJsaW5namlhdG9uZyJ9.DgEHxZ5QVtx9ybwnfAoiAQ042LC8NSkgszj34USm1qAX-qTZkKzIQw9Op7cci5TZWIKfwrVlrGVDv---ORNfQHF-jj01Fu0ozi2GXTeOTEHyQQ1-aOkuFyapXyJ-ht3XIvhEegOnjOk3BHCFSVDYLPlXKtgrIJOtWROdQTlcnVjEj0YhyiHdXDDZCvfjLf4NJfMPCLswRSYDWBzGXhX1qA_M4dvKIzjm7lNujVgPEVHaEDnQPrMWYCy4pHIlNI8aEM6hMX7aNgz6I7XqpMZeCiZZXgLjkfgsf_BzMELjycUpI055xTdYiBHGfX1Ipy6pQ_cdP1aCum7MZpjPX-kLLg";
// 添加请求拦截器
instance.interceptors.request.use(config => {
  // TODO 对接了登录接口之后再放开
  // if (process.env.NODE_ENV === "production") {
  //   let token = sessionStorage.getItem("tokenInfo");
  //   if(token) {
  //     //这里面获取的请求头的键(tokenHeader)根据每个后端的习惯封装的名称各不相同
  //     config.headers["Authorization"] = "Bearer " + JSON.parse(token).access_token;
  //   }
  // } else {
  //   config.headers["Authorization"] = "Bearer " + devToken;
  // }
  config.headers["Authorization"] = "Bearer " + devToken;
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
      message: message, type: "error", duration: 2000, center: false
    });
    return Promise.reject();
  }
}, error => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // TODO 捕获401、403、404、500等异常
  ElementUI.Message.error({
    message: "操作失败！请检查网络", type: "error", duration: 2000, center: false,
  });
  return Promise.reject(error);
});

export default instance;
