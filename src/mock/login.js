import Mock from "mockjs";
import {
  HTTP_RESULT_SUCCESS_CODE,
  HTTP_RESULT_SUCCESS_MESSAGE,
} from "@/constant/commonConstant";

// #################### 登录页面接口 #################### //

// 获取验证码接口
Mock.mock("/api-backend/refreshVerifyCode", "get", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  data: "@dataImage(100x40)",
});

// 登录接口
Mock.mock("/api-backend/login", "post", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  data: {
    userInfo: {
      username: "lingjiatong",
      email: "935188400@qq.com",
      phone: 14444444444,
      avatar: "http://f.lingjiatong.cn:30090/rootelement/sys/avatar.jpeg",
    },
    menus: [
      {
        menuName: "博客管理",
        icon: "icon-blog",
        subMenu: [
          {
            menuName: "文章管理",
            url: "/blog/article",
            routeName: "BlogArticle"
          },
          {
            menuName: "分类管理",
            url: "/blog/category",
            routeName: "BlogCategory"
          },
          {
            menuName: "评论管理",
            url: "/blog/comment",
            routeName: "BlogComment"
          },
        ],
      },
      {
        menuName: "系统管理",
        icon: "icon-setting",
        subMenu: [
          {
            menuName: "用户管理",
            url: "/system/user",
            routeName: "SystemUser"
          },
          {
            menuName: "角色管理",
            url: "/system/role",
            routeName: "SystemRole"
          },
          {
            menuName: "网站配置",
            url: "/system/websiteConfig",
            routeName: "SystemWebsiteConfig"
          },
          {
            menuName: "系统监控",
            url: "/system/monitor",
            routeName: "SystemMonitor"
          },
        ],
      },
    ],
    tokenInfo: {
      access_token:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjE2MzMzMzMzMzMzIiwidXNlcl9uYW1lIjoibGluZ2ppYXRvbmciLCJzY29wZSI6WyJhbGwiXSwiZXhwIjoxNjY3MDA1NTU1LCJ1c2VySWQiOjEsImF1dGhvcml0aWVzIjpbImJsb2ciXSwianRpIjoiMWE1Y2E2YjUtZjg4Ni00NmY1LTk4ODMtOTY5MzE1ZjZhMGJlIiwiZW1haWwiOiI5MzUxODg0MDBAcXEuY29tIiwiY2xpZW50X2lkIjoiY2xpZW50IiwidXNlcm5hbWUiOiJsaW5namlhdG9uZyJ9.GHIgVidkv2xudxvAfGxm5JLfN42ZRYgsw8CFfumBeKw10vqnk0_801Q_B4_vjXuG5w02B1UnX6blfw5vkD6BZ-Wz-Ca25s-LbWIoHeZMymxRZpUdHI3c5vQvBYnukJCBn2Qy5h0j9Qg5xHjCgGpTMGg2Iz0SfuH01e-unHKtlw6LfA4Yce38gAG3SNJKB-s3wPABzo9DmDuELOc8081wJH_FIhLaNTTNIbOidHLW6j1UoEjBQsparpg1x2Ert8bJ-DIHWvSAZRhELWbABZzyGtRtA_168cUpk6bfQlZX07ikg-Br5NXFpfv6DA-aBKKmJQt5nvjXgyNL9nifrEObBA",
      token_type: "bearer",
      refresh_token:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjE2MzMzMzMzMzMzIiwidXNlcl9uYW1lIjoibGluZ2ppYXRvbmciLCJzY29wZSI6WyJhbGwiXSwiYXRpIjoiMWE1Y2E2YjUtZjg4Ni00NmY1LTk4ODMtOTY5MzE1ZjZhMGJlIiwiZXhwIjoxNjY5NTU0MzU1LCJ1c2VySWQiOjEsImF1dGhvcml0aWVzIjpbImJsb2ciXSwianRpIjoiMTk4N2U0ZGYtNjBlNy00MzM5LWJhMDUtNzQyYzk1ZmYwMDQ1IiwiZW1haWwiOiI5MzUxODg0MDBAcXEuY29tIiwiY2xpZW50X2lkIjoiY2xpZW50IiwidXNlcm5hbWUiOiJsaW5namlhdG9uZyJ9.TpMstjFYpUr0QAcNe9-NrdVeCiL-AAgoS_csI6z6aEiHqG6q9EfOrzCf2ZmNNCBibjx4WJp8PDLJuSoZpUYYKj2TvVHRTPH2vGa1TiliKpdDpko-hi6pfEXP_DvOvwear31H1ycbcTN02pyYMzihyNdMAfhDnX5j4iqFSs74t3cp5r9kvFHI3z6gkmy0bAj9bqxLiVG4z7F1UbGJdyhhdgJRNSjPLnVZJCRiAFpFsULMfu3Y5VRZGfBLk3rBDS4wpuWg8_BlufOX9KBxtrYjG6gJ8zrm8RB8F3c8V62AA8UPVSsiGrrAEcSsMiGiQQ1ka8-9igmCmteEMVb_QarjVw",
      expires_in: 43199,
      scope: "all",
      jti: "1a5ca6b5-f886-46f5-9883-969315f6a0be",
    },
  },
});
