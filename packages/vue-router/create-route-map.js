export function createRouteMap(routes, oldPathList, oldPathMap) {
  const pathList = oldPathList || [];
  const pathMap = oldPathMap || Object.create(null);

  routes.forEach(route => addRouteRecord(pathList, pathMap, route))

  return {
    pathList,
    pathMap,
  }
}

function addRouteRecord(pathList, pathMap, route, parent) {
  let { path, name, component } = route;
  path = parent ? `${parent.path}/${path}` : path;
  const record = {
    path,
    component,
    parent,
    name,
  }

  if (!pathMap[path]) {
    pathList.push(path);
    pathMap[path] = record;
  }

  if (route.children) {
    route.children.forEach(route =>addRouteRecord(pathList, pathMap, route, record))
  }
}