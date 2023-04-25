class RouteUtil {

  static VIEW_ROUTE_PATH_PREFIX = "src/view/"

  // 深度优先算法处理路由列表
  static dfsRouteList(route) {
    let componentPath = route.component.substring(RouteUtil.VIEW_ROUTE_PATH_PREFIX.length);
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
