import { createRouteMap } from "./create-route-map";
import { createRoute } from './history/base';

export function createMatcher(routes, router) {
  const { pathList, pathMap } = createRouteMap(routes);

  function match(path) {
    let record = pathMap[path];
    // record: { path, component, parent }
    return createRoute(record, { path });
    // { path, matched: [ record ] }
  }

  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap);
  }

  return {
    addRoutes,
    match,
  }
}
