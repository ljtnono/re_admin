import Mock from "mockjs";
import {
  HTTP_RESULT_SUCCESS_CODE,
  HTTP_RESULT_SUCCESS_MESSAGE,
} from "@/constant/commonConstant";

// #################### 系统管理——用户管理接口 #################### //

// 获取用户列表参数
Mock.mock("/api-backend/system/user/list", "get", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  "data|10": [
    {
      id: "@increment(1)",
      username: "@word(4,20)",
      phone: /^1[3456789]\d{9}$/,
      email: "93188400@qq.com",
      avatarUrl: "@dataImage(180x120)",
      createTime: "@datetime()",
      modifyTime: "@datetime()",
      deleted: 0,
      roleIdList: [1, 2, 3],
    },
  ],
});
