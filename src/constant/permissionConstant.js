import store from "@/store";
// 权限id与权限表达式映射
const permissionMap = {
  // 工作台相关
  "workspace": 10000,

  // 博客管理相关
  "blog": 10100,
  // 博客管理-文章管理
  "blog:article": 10101,
  "blog:article:read": 10102,
  "blog:article:write": 10103,
  // 博客管理-分类管理
  "blog:category": 10111,
  "blog:category:read": 10112,
  "blog:category:write": 10113,
  // 博客管理-评论管理
  "blog:comment": 10121,
  "blog:comment:read": 10122,
  "blog:comment:write": 10123,

  // 系统管理相关
  "system": 10200,
  // 系统管理-用户管理
  "system:user": 10201,
  "system:user:read": 10202,
  "system:user:write": 10203,
  // 系统管理-角色管理
  "system:role": 10211,
  "system:role:read": 10212,
  "system:role:write": 10213,
  // 系统管理-菜单管理
  "system:menu": 10241,
  "system:menu:read": 10242,
  "system:menu:write": 10243,
  // 系统管理-网站配置
  "system:websiteConfig": 10221,
  "system:websiteConfig:read": 10222,
  "system:websiteConfig:write": 10223,
  // 系统管理-系统监控
  "system:monitor": 10231
}

/**
 * 判断是否含有指定表达式的权限
 *
 * @param expression 权限表达式
 * @returns 有该权限返回true，没有则返回false
 */
export const hasPermission = (expression) => {
  let userPermissionIdList = store.user.userInfo.permissionIdList;
  let expressionPermissionId = permissionMap[expression];
  return userPermissionIdList.includes(expressionPermissionId);
}






