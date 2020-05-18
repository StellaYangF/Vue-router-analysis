# 前言
本篇文章分两个部分：
- 第一部分为 **vue-router 使用篇**
- 第二部分为 **实现简易的 Vue-router**

主要通过阅读官方文档以及仓库源码学习实践，持续学习实践、持续思考。

Practice makes perfect.

To get a better command of Vue-router.

# vue-router 使用篇
本文为新手入门级 vue-router 使用篇。
如果对 Vue-router 较熟悉的，可直接跳过。

具体可参考官网 [router](https://router.vuejs.org/)

## 下载
npm
```bash
npm install vue-router
```
通过模块系统方式，引入 router 通过 `Vue.use()` 进行注册：
```js
import Vue from 'Vue';
import  VueRouter from 'vue-router';

Vue.use(VueRouter);
```


# 实现简易的 Vue-router
## 什么是 vue-router？
Vue router 是 Vue.js 框架的官方路由，深度集成 Vue.js 核心，可轻松构建一个单页应用。
在单页应用中，保证在不刷新页面的前提下，根据不同的路径显示不同的组件视图。


**vue-router** 和 **vuex** 本质都是 Vue 插件，提供 **install** 方法，供 **Vue.use** 进行注册
```js
import VueRouter from 'vue-router';

Vue.use(VueRouter);
```
> Tip: 上述代码中，就是实现对 VueRouter 的注册，内部核心就是调用 `VueRouter.install()`，并传入 `Vue` 类

接下来实现构建的大概流程，注意：本篇只是简易地实现，与源码有一定出入，详细阅读 [vue-router](https://github.com/vuejs/vue-router/tree/588220c475b29e038bc6c0badddac7992bf27445/src)

## 构建
### 目录结构
```sh
└── vue-router
    └── src
        ├── index.js
        ├── install.js
        ├── create-matcher.js
        ├── create-route-map.js
        ├── history
        │   ├── base.js
        │   ├── hash.js
        │   ├── html5.js
        └── components
            ├── view.js
            └── link.js
```

### 核心入口文件
#### 引入依赖包
```js
import install from './install';
import { createMatcher } from './create-matcher';
import { HashHistory } from './history/hash';
import { HTML5History } from './history/html5';
```

#### VueRouter 类
```js
class VueRouter {
  constructor(options = {}) {
    this.app = null;
    this.options = options;
    this.matcher = createMatcher(options.routes || [], this);

    let mode = options.mode || 'hash';
    this.mode = mode;
    this.beforeEaches = [];

    switch(mode) {
      case 'history':
        this.history = new HTML5History(this);
        break;
      case 'hash':
        this.history = new HashHistory(this, options.base);
        break;
      default:
        console.assert(false, `invalid mode: ${mode}`)
    }
  }

  push(location) {
    this.history.transitionTo(location, () => window.location.hash = location)
  }

  match(location) {
    return this.matcher.match(location); // { path, matched: [ record ] }
  }

  init(app) {
    const history = this.history;
    const setupHashListener = () => history.setupListener();
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener
    )

    history.listen(route => app._route = route)
  }

  beforeEach(cb) {
    this.beforeEaches.push(cb);
  }
}
```

#### 挂载 install 到 VueRouter 类上(静态方法)
```js
VueRouter.install = install;
```
> Tip: 这一步是供 `Vue.use()` 调用的核心插件思想

#### 导出
默认导出，可直接通过 `import VueRouter from 'vue-router'` 引入
```js
export default VueRouter;
```

### install 方法

```js
import View from './components/view';
import Link from './components/link';

let Vue;

export default function install(_Vue) {
  if (install.installed && _Vue === Vue) return;
  install.installed = true;
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
    }
  })

  // dynamic property
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router;
    }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route;
    }
  });

  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);
};
```

### create-matcher
```js
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

```

### create-route-map
```js
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
```

### components
#### RouterView
```js
export default {
  functional: true,
  render(h, { parent, data}) {
    let route = parent.$route
    let depth = 0;

    while(parent) {
      if (parent.$vnode && parent.$vnode.data.routerView ) {
        depth ++;
      }
      parent = parent.$parent;
    }
    data.routerView = true;
    let record = route.matched[depth];
    if (!record) return h();
    
    return h(record.component, data);
  }
}
```

#### RouterLink
```js
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: "a",
    },
  },
  methods: {
    handler() {
      this.$router.push(this.to);
    },
  },
  render(h) {
    let tag = this.tag;
    return <tag onClick={this.handler}>{this.$slots.default}</tag>;
  },
};
```

### history
### base
```js
export class History {
  constructor(router) {
    this.router = router;
    this.current = createRoute(null, { path: '/' }); // { path, matched: [ record ] }
  }

  listen(cb) {
    this.cb = cb;
  }

  transitionTo(location, onComplete) {
    let record = this.router.match(location, this.current);
    // { path, matched: [record] }
    if (location == this.current.path && record.matched.length == this.current.matched.length) {
      return;
    }
    onComplete && onComplete();

    let queue = this.router.beforeEaches || [];
    const iterator = (hook, next) => hook(record, this.current, next);
    runQueue(queue, iterator, () => this.updateRoute(record));
  }

  updateRoute(record) {
    this.current = record;
    this.cb && this.cb(record);
  }

  setupListener() {
    window.addEventListener('hashchange', () => this.transitionTo(window.location.hash.slice(1)));
  }

}

// record: { path, component, parent }
// path: { path }
export function createRoute(record, pathOption) {
  let matched = [];
  if (record) {
    while (record) {
      matched.unshift(record);
      record = record.parent;
    }
  }
  return {
    ...pathOption,
    matched,
  };
}

function runQueue(queue, iterator, callback) {
  function step(index) {
    if (index === queue.length) return callback();
    let hook = queue[index];
    iterator(hook, ()=> step(index+1));
  }
  step(0)
}
```

### hash
```js
import { History } from './base';

function ensureSlash() {
  if (window.location.hash) return;
  window.location.hash = '/';
}

export class HashHistory extends History{
  constructor(router) {
    super(router);
    ensureSlash();
  }

  getCurrentLocation() {
    return window.location.hash.slice(1);
  }
}


```

### html5
```js
// todos
```

Here are basic steps. In the following, detailed information will be added.