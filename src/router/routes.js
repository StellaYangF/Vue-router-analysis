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
    components: {
      default: Home,
      profile: Profile,
      articles: Articles,
      about: About,
    }
  },
  {
    path: "/about",
    name: "about",
    component: About,
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
        component: () => import('@/views/A.vue'),
        props:true,
      }
    ]
  },
  {
    path: "*",
    component: () => import('@/views/NotFound.vue')
  }
];