import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Profile from '@/views/Profile.vue';
import Articles from '@/views/Articles.vue';

export default [
  {
    path: "/",
    // path
    // redirect: '/about',

    // name
    // redirect: {
    //   name: 'a'
    // },

    // arrow function
    // redirect: to => {
    //   console.log(to);
    //   return '/about'
    // },
    name: "home",
    component: Home,
    // components: {
    //   default: Home,
    //   profile: Profile,
    //   articles: Articles,
    //   about: About,
    // }
  },
  {
    path: "/about",
    name: "about",
    component: About,
    meta: {
      requiredAuth: false,
    },
    // alias: '/aboutalias',
    children: [
      {
        path: "a",
        name: "a",
        component: {
          render(h) {
            return <h1>about a</h1>;
          }
        }
      },
      {
        path: "b/:id",
        name: "b",
        component: () => import(/* webpackChunkName: "group-about" */'@/views/B.vue'),
        props:true,
      },
      {
        path: "c/:id",
        name: "c",
        component: () => import(/* webpackChunkName: "group-about" */'@/views/C.vue'),
        props:true,
      }
    ]
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "notFound" */'@/views/NotFound.vue')
  }
];