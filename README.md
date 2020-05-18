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