import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    btnPermission: {
      edit: true,
      delete: true,
      add: true,
      search: true
    }
  },
  mutations: {
    
  },
  actions: {
  },
  modules: {
  }
})
