class RouteUtil {

  /**
   * 根据路由名称获取面包屑导航
   *
   * @param routeName 路由名称
   */
  static getBreadcrumb(routeName) {
    if (routeName === "Workspace") {
      return ["工作台"]
    } else if (routeName === "UpdatePassword") {
      return ["修改密码"]
    } else if (routeName === "WriteArticle") {
      return ["写文章"]
    } else if (routeName === "Personal") {
      return ["个人中心"]
    } else if (routeName === "BlogArticle") {
      return ["博客管理", "文章管理"]
    } else if (routeName === "BlogCategory") {
      return ["博客管理", "分类管理"]
    } else if (routeName === "BlogComment") {
      return ["博客管理", "评论管理"]
    } else if (routeName === "SystemUser") {
      return ["系统管理", "用户管理"]
    } else if (routeName === "SystemRole") {
      return ["系统管理", "角色管理"]
    } else if (routeName === "SystemMenu") {
      return ["系统管理", "菜单管理"]
    } else if (routeName === "SystemWebsiteConfig") {
      return ["系统管理", "网站配置"]
    } else if (routeName === "SystemMonitor") {
      return ["系统管理", "系统监控"]
    } else {
      return [];
    }
  }

  // 深度优先算法处理路由列表
  static dfsRouteList(route) {
    let componentPath = route.component.substring("src/view/".length);
    let routeConfig = {
      name: route.name,
      path: route.path,
      redirect: route.redirect ? JSON.parse(route.redirect) : null,
      props: route.props,
      meta: JSON.parse(route.meta),
      component: () => import("@v/" + componentPath)
    };
    let childrenSource = route.children;
    if (childrenSource === null || childrenSource === []) {
      routeConfig.children = [];
      return routeConfig;
    }
    routeConfig.children = childrenSource.map(child => {
      return this.dfsRouteList(child);
    });
    return routeConfig;
  }
}

export default RouteUtil;
