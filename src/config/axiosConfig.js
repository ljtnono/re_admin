import axios from "axios";
import {
  HTTP_RESULT_SUCCESS_CODE, HTTP_RESULT_SUCCESS_MESSAGE,
} from "@/constant/commonConstant";
import ElementUI from "element-ui";

const instance = axios.create();
// 开发环境使用的token
const devToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjE2MzMzMzMzMzMzIiwidXNlcl9uYW1lIjoibGluZ2ppYXRvbmciLCJzY29wZSI6WyJhbGwiXSwiZXhwIjoxNjcyMjU4NDc1LCJ1c2VySWQiOjEsImF1dGhvcml0aWVzIjpbImJsb2ciXSwianRpIjoiMjFkM2QzMWMtZjEzMS00MzVhLTgxMTMtMDY2YjgxMjU0ODA4IiwiZW1haWwiOiI5MzUxODg0MDBAcXEuY29tIiwiY2xpZW50X2lkIjoiY2xpZW50IiwidXNlcm5hbWUiOiJsaW5namlhdG9uZyJ9.KMT9ExcoeP35kalMgo7yAyr_krp5zzMMOGvxkbETa8yNgA4CvCmp4CG3BFYupBhJk3RDtB0Uh24yyrAnJqfn1wNjc6qazTGmf91mZSJDf9J7FgNmzyBENvvHgA3W4-FfqbVxsjOT60Yz292z11zb_ujWJ4P4GJnwDL89UKPj3M3EQmZEoQumFw7pZ_xXS532pfoZVE6LY-Tlv2tqUHAGMRhEfc9pttnF7Y9uVgJwwe22uo0t0itb4-x1MBm7FvZK1RwRezCz9w5r49tsZiR3uUTm8v1b3rDPcHr8tMZnsdWktUeuDG-aU7lWVhtF4Q44LaLZBsyy64gHqP_45bPt0w";
// 添加请求拦截器
instance.interceptors.request.use(config => {
  // if (process.env.NODE_ENV === "production") {
  //   let token = sessionStorage.getItem("tokenInfo");
  //   if(token) {
  //     //这里面获取的请求头的键(tokenHeader)根据每个后端的习惯封装的名称各不相同
  //     config.headers.common["Authorization"] = "Bearer " + JSON.parse(token).access_token;
  //   }
  // } else {
  //   config.headers.common["Authorization"] = "Bearer " + devToken;
  // }
  config.headers.common["Authorization"] = "Bearer " + devToken;
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
