import axios from "axios"
import qs from "qs"
import Mock from "mockjs";

// 获取用户菜单栏列表接口s
Mock.mock("/api-backend/user/menus", "get", {
  code: 0,
  data:  [

  ]
})
