# 前言
本篇文章分两个部分：
- 第一部分为 **实现简易的 Vue-router**
- 第二部分为 **vue-router 使用篇**

主要通过阅读官方文档以及仓库源码学习实践，持续学习实践、持续思考。

Practice makes perfect.

To get a better command of Vue-router.


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

### 核心入口文件 index.js
#### 引入依赖包

```js
import install from './install';
import { createMatcher } from './create-matcher';
import { HashHistory } from './history/hash';
import { HTML5History } from './history/html5';
```

上述依赖包作用如下：
- **install** 注册函数
- **createMatcher(routes)** 生成匹配器，返回两个函数
  - **addRoutes(routes)** 动态添加路由
  - **match(location)** 根据路径匹配，返回结果为：
  ```ts
  type Record = {
      path: String
      component: VueComponent
      parent: Record
  }
  type MatchedObject = {
    path: String
    matched: [ Record ]
  }
  ```
- **HashHistory** 基于 hash 的路由控制
- **Html5History** 基于 html5 History API 实现

#### 实现 VueRouter 类
```js
class VueRouter {
  constructor(options = {}) {
  }
}
```
#### 实例属性
##### **matcher** 匹配器
```js
this.matcher = createMatcher(options.routes || [], this);
```
初始化之后的 matcher 属性为一个对象：
```ts
this.matcher = {
  match(location): MatchedObject
  addRoutes(routes): void
}
```

##### **beforeEaches**
```js
this.beforeEaches = [];
```
用户调用 `this.beforeEach(cb)` 订阅 beforeEach 钩子函数的数组

##### **mode** 路由控制模式
```js
let mode = options.mode || 'hash';
this.mode = mode;
```

##### **history** 核心，根据 mode 实例化不同的 History
```js
switch(mode) {
  case 'history':
    this.history = new HTML5History(this);
    break;
  case 'hash':
    this.history = new HashHistory(this);
    break;
  default:
    console.assert(false, `invalid mode: ${mode}`)
}
```

#### 实例方法
##### **push(location)** 跳转路径
```js
push(location) {
  this.history.transitionTo(location, () => window.location.hash = location)
}
```
##### **match(location)** 匹配路径，渲染对应的组件
```js
match(location) {
  return this.matcher.match(location); // { path, matched: [ record ] }
}
```

##### **init(app)** 初始化工作
在 **install** 函数内部，`Vue.mixin(option)` 全局混入 `beforeCreate()` 内部会调用 `init(vueInstance)`，把根实例传入
```js
init(app) {
  const history = this.history

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation())
  } else if (history instanceof HashHistory) {
    const setupHashListener = () => {
      history.setupListeners()
    }
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    )
  }
    
  history.listen(route => app._route = route)
}
```

初始化工作做了两步：
- 调用 `history.transitionTo(location, callback?)`
  - history 是 HTML5History 实例，直接调用 `history.transitionTo(history.getCurrentLocation())`
  - history 是 HashHistory 实例，需传入 callback，内部调用 `window.addEventListener('hashChange', cb)`，监听 hash 的变化，一旦 hash 变了，立即调用 `history.transitionTo()`
    - 执行 `beforeEaches` 数组的钩子 函数
    - 更新 `history.current` 值
    - 执行 `history.cb(history.current)`
- 执行 `history.listen(callback)`

##### **beforeEach(cb)** 订阅全局钩子函数
```js
beforeEach(cb) {
  this.beforeEaches.push(cb);
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
#### 引入依赖包
```js
import View from './components/view';
import Link from './components/link';
```
引入就是 **ViewRouter**, **ViewLink** 两个需要注册的全局组件

#### 声明变量 Vue
```js
let Vue;
```
这一步统一使用当前应用下载 Vue.js 版本统一。
Vue 在进行插件注册执行 install 方法，会自动传入 Vue 参数

#### install 核心
##### 导出 install 方法
```js
export default function install(_Vue) {
  // ...
}
```

##### 判断 install 是否重复调用
```js
if (install.installed && _Vue === Vue) return;
install.installed = true;
```

##### 接收 _Vue 参数，赋值给准备好的 Vue 变量
```js
Vue = _Vue;
```
  
##### 执行 Vue.mixin()
核心功能实现
- 传入 `beforeCreate` 属性函数，为每个组件混入该生命周期函数，即：每个 Vue 的组件都会执行该函数，且先于组件自己的 beforeCreate 函数执行

- 给当前组件实例增加属性
  - 根组件： 
    - **this._routerRoot** 指向自己(根组件实例)
    - **this._router** 传入用户调用 **new VueRouter** 的实例
    - **this._router.init(this)** 初始化工作，详细可参考 **VueRouter.prototype.init** 的工作流
    - **Vue.util.defineReactive(this, '_route', this._router.history.current)** 给 Vue 根实例增加相应式数据，一旦路径改变，依赖收集的组件自动更新
  - 子组件实例：
    - **this._routerRoot** 指向根组件实例
```js
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
```

##### 代理 Vue.prototype.$router, Vue.prototype.$route 属性
```js
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
```
> 通过 Vue.mixin 为每个组件添加了 `this._routerRoot` 属性，这个值永远指向 Vue 的根实例

##### 注册全局组件
```js
Vue.component('RouterView', View);
Vue.component('RouterLink', Link);
```

### create-matcher
服务 VueRouter，接收 `routes`, `router`，返回一个对象 **{ match, addRoutes }**

#### 引入依赖包
两个依赖包都是辅助函数
- **createRouteMap(routes)** 通过用户定义的 **routes** 进行格式化，返回:
  - `pathList:[]`
  - `pathMap:{ path: Record }` 
- **createRoute(record, locationObject)** ，返回：
  - `path` String
  - `matched` [ Record ]

```js
import { createRouteMap } from "./create-route-map";
import { createRoute } from './history/base';
```

#### 导出 createMatcher 函数
内部实现两个函数，并返回包含这两个函数的对象
```js
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
> Tip: 这里运用闭包，createMatcher 函数作用域体内，声明并初始化了两个常量，`pathList`, `pathMap`，返回的两个函数内部都访问了当前这个作用域内的变量
由于内层作用域访问外层作用域内的变量，其他无法释放，就形成闭包。

### create-route-map
#### 功能
通过 createMatcher 可发现 createRouteMap 能两用
- 只传入 **routes** 时，内部构建产生 `pathList`, `pathMap`
- 动态创建路由时，传入三个参数 **routes**, **pathList**, **pathMap**，通过引用指针，访问已被初始化后的 **pathList**, **pathMap**

#### 核心
根据用户定义的 routes 生成格式化的数据，routes 结构为：
```ts
routes?: RouteConfig[]

export interface RouteConfig {
  path: string
  name?: string
  component?: Component
  components?: Dictionary<Component>
  redirect?: RedirectOption
  alias?: string | string[]
  children?: RouteConfig[]
  meta?: any
  beforeEnter?: NavigationGuard
  props?: boolean | Object | RoutePropsFunction
  caseSensitive?: boolean
  pathToRegexpOptions?: PathToRegexpOptions
}
```

流程：
- 内部声明两个变量 `pathList`, `pathMap`
- 迭代 routes 对一个 route 进行格式化
- 返回 `pathList`, `pathMap` 构成的对象
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
```

#### 辅助函数 addRouteRecord
流程：
- 接收四个参数：`pathList`, `pathMap`, `route`, `parent`。
  - **parent** 记录当前路径嵌套的父路径记录
- 对传入的路径 `path` 格式化，并添加到 pathList 数组中，如：[ '/', '/user/email', '/user/info' ]
- 将 `path` 对应的路由记录 `record`，存放在 `pathMap` 映射表中
- 如果当前记录下，有嵌套的 **children** 子路径，递归执行 **addRouteRecord**
```js
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
    route.children.forEach(route => addRouteRecord(pathList, pathMap, route, record))
  }
}
```

### components
提供两个全局的组件，两者都是函数式组件
  - **RouterView**
  - **RouterLink**

#### RouterView
流程：
- 需要添加 `functional` 属性为 `true`，无状态的纯函数
- `render` 函数内部拿到当前 ViewRouter 组件的父组件，这里基于之前在 **install** 函数中实现的 
  ```js
  Vue.mixin({
    beforeCreate() {
      Vue.util.defineReactive(this, '_route', this._router.history.current);
    }
  })
  Object.defineProperty(Vue.prototype, '$route', {get() {return this._routerRoot._route;}})
  ```
  这两步就能在组件中拿到 `parent.$route`，由于已被定义为响应式数据，当路径改变时，会自动触发当前 `ViewRouter` 占位符更新渲染对应的组件
- 由于会存在嵌套的 ViewRouter, 就会产生一个路径匹配了多个 route，如： { path: '/user/email', matched: [ { path: '/user', component: User }, { path: '/user/email', component: UserEmail } ] }, 需要对上层已匹配渲染的 ViewRouter 进行标记，便于正确渲染。

```js
export default {
  functional: true,
  render(h, { parent, data}) {
    let route = parent.$route
    let depth = 0;

    // 递归查找 是否有被嵌套在某个祖先级组件下
    while(parent) {
      // $vnode 为组件占位符
      // 可以为组件占位符添加数据 data 
      // 如：<view-router></view-router>

      if (parent.$vnode && parent.$vnode.data.routerView ) {
        depth ++;
      }
      parent = parent.$parent;
    }
    // 匹配到当前组件占位符后，给 data 添加 routerView 属性
    // 如：path: '/user' => 匹配 <view-router></view-router>
        // path: '/user/email' => 查找到自己是嵌套在 /user 的 <view-router> 下，就会将 depth ++， 渲染其匹配的 matched 数组下标为 1 的组件
    data.routerView = true;
    let record = route.matched[depth];
    if (!record) return h();
    
    return h(record.component, data);
  }
}
```

#### RouterLink
接收两个属性
- `to`: 必填，表示要变化跳转的路径
- `tag`: 选填，可以自定义当前组件的标签名

使用时的模板
```js
<view-link to='/user'>go to user</view-link>
```

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
由于存在两种形式的路由，引入基类 `History`，实现通用方法和属性。

#### History 基类
history/base.js
##### 核心
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
```

##### createRoute 辅助函数
- 生成当前路径对应的匹配数组
- 导出供逻辑复用
```js
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
```

##### runQueue 迭代生成器
这是经典的函数思想（中间件概念？），按顺序迭代用户定义的 hook 函数，并将向下执行的决定权交给用户，即：调用 next() 执行
流程：
- 接收三个参数
- 定义计步函数接收，要迭代数组对应的下标
- 将下标对应的 hook 取值，执行 `iterator(hook, next)`
   - `iterator` 函数已被定义好： iterator(hook, next) => hook(to: param1, from: param2, next: Function)
- `next: () => step(index+1)` 核心就是把指针向后移动，如：
  ```js
  beforeEnter(to, from, next) { 
    // ... 用户在 hook 内执行了逻辑
    // 只有调用 next 才会向后执行下一个 hook， 或者是最终的 出口函数callback
    next();
  }
  ```
```js
function runQueue(queue, iterator, callback) {
  function step(index) {
    if (index === queue.length) return callback();
    let hook = queue[index];
    iterator(hook, ()=> step(index+1));
  }
  step(0)
}
```
> Tip: 中间件概念，在 `koa`, `express`, `axios` 中都用到过。

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


Here are basic steps. In the following, detailed information will be added.