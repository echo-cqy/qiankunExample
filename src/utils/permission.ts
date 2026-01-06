import type { RouteObject } from 'react-router-dom';

// 扩展 RouteObject 类型以支持 meta
export type AppRouteObject = RouteObject & {
  meta?: {
    title?: string;
    permissions?: string[]; // 该路由需要的权限
    key?: string;
  };
  children?: AppRouteObject[];
};

function hasPermission(route: AppRouteObject, userPermissions: string[]) {
  if (route.meta?.permissions) {
    // 只要拥有路由所需权限中的任意一个即可访问
    return route.meta.permissions.some((p) => userPermissions.includes(p));
  }
  return true; // 没有配置 permissions 则默认允许访问
}

export function filterRoutesByPermission(
  routes: AppRouteObject[],
  userPermissions: string[]
): AppRouteObject[] {
  const res: AppRouteObject[] = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(tmp, userPermissions)) {
      if (tmp.children) {
        tmp.children = filterRoutesByPermission(tmp.children, userPermissions);
      }
      res.push(tmp);
    }
  });

  return res;
}
