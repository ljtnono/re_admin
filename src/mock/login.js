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
Mock.mock("/api-backend/auth", "post", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  data: {
    "userInfo": {
      "id": 1,
      "username": "lingjiatong",
      "email": "935188400@qq.com",
      "phone": "15337106753",
      "avatarUrl": "http://f.lingjiatong.cn:30090/rootelement/sys/avatar.jpeg",
      "permissionIdList": [
        10000,
        10100,
        10101,
        10102,
        10103,
        10111,
        10112,
        10113,
        10121,
        10122,
        10123,
        10200,
        10201,
        10202,
        10203,
        10211,
        10212,
        10213,
        10221,
        10222,
        10223,
        10231
      ]
    },
    "menus": [
      {
        "id": 10000,
        "parentId": -1,
        "title": "博客管理",
        "icon": "icon-blog",
        "name": "Blog",
        "path": null,
        "children": [
          {
            "id": 10001,
            "parentId": 10000,
            "title": "文章管理",
            "icon": null,
            "name": "BlogArticle",
            "path": "/blog/article",
            "children": null
          },
          {
            "id": 10002,
            "parentId": 10000,
            "title": "分类管理",
            "icon": null,
            "name": "BlogCategory",
            "path": "/blog/category",
            "children": null
          },
          {
            "id": 10003,
            "parentId": 10000,
            "title": "评论管理",
            "icon": null,
            "name": "BlogComment",
            "path": "/blog/comment",
            "children": null
          }
        ]
      },
      {
        "id": 10100,
        "parentId": -1,
        "title": "系统管理",
        "icon": "icon-setting",
        "name": "System",
        "path": null,
        "children": [
          {
            "id": 10101,
            "parentId": 10100,
            "title": "用户管理",
            "icon": null,
            "name": "SystemUser",
            "path": "/system/user",
            "children": null
          },
          {
            "id": 10102,
            "parentId": 10100,
            "title": "角色管理",
            "icon": null,
            "name": "SystemRole",
            "path": "/system/role",
            "children": null
          },
          {
            "id": 10103,
            "parentId": 10100,
            "title": "网站配置",
            "icon": null,
            "name": "SystemWebsiteConfig",
            "path": "/system/websiteConfig",
            "children": null
          },
          {
            "id": 10104,
            "parentId": 10100,
            "title": "系统监控",
            "icon": null,
            "name": "SystemMonitor",
            "path": "/system/monitor",
            "children": null
          }
        ]
      }
    ],
    "tokenInfo": {
      "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjE1MzM3MTA2NzUzIiwidXNlcl9uYW1lIjoibGluZ2ppYXRvbmciLCJzY29wZSI6WyJhbGwiXSwiZXhwIjoxNjcyNTE1NjU2LCJ1c2VySWQiOjEsImF1dGhvcml0aWVzIjpbImJsb2c6Y29tbWVudCIsInN5c3RlbTp1c2VyIiwic3lzdGVtOnJvbGU6d3JpdGUiLCJzeXN0ZW06d2Vic2l0ZUNvbmZpZzpyZWFkIiwic3lzdGVtOm1vbml0b3IiLCJ3b3Jrc3BhY2UiLCJibG9nOmNhdGVnb3J5IiwiYmxvZzpjb21tZW50OndyaXRlIiwic3lzdGVtOndlYnNpdGVDb25maWciLCJibG9nOmFydGljbGUiLCJibG9nOmFydGljbGU6cmVhZCIsInN5c3RlbTp1c2VyOndyaXRlIiwiYmxvZzpjb21tZW50OnJlYWQiLCJibG9nOmNhdGVnb3J5OnJlYWQiLCJibG9nIiwiYmxvZzphcnRpY2xlOndyaXRlIiwic3lzdGVtOnVzZXI6cmVhZCIsInN5c3RlbSIsInN5c3RlbTpyb2xlIiwic3lzdGVtOndlYnNpdGVDb25maWc6d3JpdGUiLCJibG9nOmNhdGVnb3J5OndyaXRlIiwic3lzdGVtOnJvbGU6cmVhZCJdLCJqdGkiOiI1ZTk5NTJjZi1lNjJmLTQ3ZDUtOTY2My1jYTAxOTQ2NTY4ZjQiLCJlbWFpbCI6IjkzNTE4ODQwMEBxcS5jb20iLCJjbGllbnRfaWQiOiJyZV9hZG1pbiIsInVzZXJuYW1lIjoibGluZ2ppYXRvbmcifQ.VQlWADF9GOY5WBy3gZLVI_7Emk58jSDPmo7xakRK1zWvfuUfgRih1HvUx0H50qV67bSkfQ-TSfJLmrmzdBvzgkLuEoyGgJFQE6LcCGjdJwrQy1_1nr9WriYywYyDj5_5ulPqPOBLehyJq6b6czPgA7Lv-w9z8oWSO3OJ8ENr3j0hqmN8YWIYTT4F3GCRXeXY4wKJm6avtWXnQzL3JyvWkizM-izMy3thMvnAqoV_83lTYEmFNutSqvYTBowe4fjOfo2aZCz_Zg3EPAYf0r5BgLJukhPtjaV7oe4IZ6O7JmN4NnsggOmo2jlX6gK7XsmdXCPqJ2xYLaqo-C0A6333Pg",
      "tokenType": "bearer",
      "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjE1MzM3MTA2NzUzIiwidXNlcl9uYW1lIjoibGluZ2ppYXRvbmciLCJzY29wZSI6WyJhbGwiXSwiYXRpIjoiNWU5OTUyY2YtZTYyZi00N2Q1LTk2NjMtY2EwMTk0NjU2OGY0IiwiZXhwIjoxNjc1MDc4ODU2LCJ1c2VySWQiOjEsImF1dGhvcml0aWVzIjpbImJsb2c6Y29tbWVudCIsInN5c3RlbTp1c2VyIiwic3lzdGVtOnJvbGU6d3JpdGUiLCJzeXN0ZW06d2Vic2l0ZUNvbmZpZzpyZWFkIiwic3lzdGVtOm1vbml0b3IiLCJ3b3Jrc3BhY2UiLCJibG9nOmNhdGVnb3J5IiwiYmxvZzpjb21tZW50OndyaXRlIiwic3lzdGVtOndlYnNpdGVDb25maWciLCJibG9nOmFydGljbGUiLCJibG9nOmFydGljbGU6cmVhZCIsInN5c3RlbTp1c2VyOndyaXRlIiwiYmxvZzpjb21tZW50OnJlYWQiLCJibG9nOmNhdGVnb3J5OnJlYWQiLCJibG9nIiwiYmxvZzphcnRpY2xlOndyaXRlIiwic3lzdGVtOnVzZXI6cmVhZCIsInN5c3RlbSIsInN5c3RlbTpyb2xlIiwic3lzdGVtOndlYnNpdGVDb25maWc6d3JpdGUiLCJibG9nOmNhdGVnb3J5OndyaXRlIiwic3lzdGVtOnJvbGU6cmVhZCJdLCJqdGkiOiIzYTI1OGRlMC00NjgxLTQ5MmEtODc3ZS00ZTRkNDJmMjYyM2YiLCJlbWFpbCI6IjkzNTE4ODQwMEBxcS5jb20iLCJjbGllbnRfaWQiOiJyZV9hZG1pbiIsInVzZXJuYW1lIjoibGluZ2ppYXRvbmcifQ.Eit1nFd4EM6zhtyEbF6cuPzoLPNAUPKBPsQSvpvVZiD_pG5TCBvVp59qM9-SpNa8StKQzqX2pkg1TY8Ylj_43uLvw1sFU3gaVKYaDfF1Fod_cyg06e8_EW8NbXjfzAIBoQ1DQkQAGrDEB5xfvpHNbWpY-ukQqJ0ijVPx3Iy-JaHDz9sMZHyfa4HJDVVybSQ9YVXzQLoCl6ZfUqio2b5a_4SsmlM1-9xO2nHbOJaqPeeSqpUnFSackdnJQYfxumS791Qurwr7sNciIbMNzbj4EkgxtUkFB50AB_6wTTWAjm10ckw1f0hoVgRO14lpgYRSPJxwAxYAflYxTyxjAP8q8Q",
      "expiresIn": 28799,
      "scope": [
        "all"
      ],
      "jti": "5e9952cf-e62f-47d5-9663-ca01946568f4"
    }
  }
});
