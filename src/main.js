import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import has from './directives/has';

Vue.config.productionTip = false
Vue.directive(has.name, has);

new Vue({
  name: 'root',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
