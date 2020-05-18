import Vue from "vue";
import VueRouter from 'vue-router'
// import VueRouter from "@/vue-router";
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes,
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) return savedPosition;
  //   return {
  //     x: 100, y: 100
  //   }
  // }
});

export default router;
