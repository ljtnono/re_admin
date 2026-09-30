// Vite 环境下无法使用变量拼接的动态 import，改用 import.meta.glob 预加载所有视图组件
const viewModules = import.meta.glob("/src/view/**/*.vue");

class RouteUtil {

  // 深度优先算法处理后端下发的路由列表
  static dfsRouteList(route) {
    const moduleKey = "/" + route.component;
    const routeConfig = {
      name: route.name,
      path: route.path,
      redirect: route.redirect ? JSON.parse(route.redirect) : undefined,
      props: route.props,
      meta: JSON.parse(route.meta),
      component: viewModules[moduleKey] || (() => import("@v/StubPage.vue"))
    };
    const childrenSource = route.children;
    if (!childrenSource || childrenSource.length === 0) {
      routeConfig.children = [];
      return routeConfig;
    }
    routeConfig.children = childrenSource.map((child) => this.dfsRouteList(child));
    return routeConfig;
  }
}

export default RouteUtil;
