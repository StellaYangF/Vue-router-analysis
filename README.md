# vue-router 使用篇
本文为新手入门级 vue-router 使用篇。
vue-router 路由方式 **mode** 有两种形式：
- **hash** 默认属性值，基于 URL hash（锚点）触发完整的 URL，实现URL 改变不用重新加载页面。
- **history** 基于HTML5 浏览器 History API

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
