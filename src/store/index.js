import Vue from 'vue'
import Vuex from 'vuex'
import VuexWebExtensions from 'vuex-webextensions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showcases: {},
    isLoading: false,
    domain: null
  },
  getters: {
    isLoading (state) { return state.isLoading },
    showcase (state) {
      return state.domain ? state.showcases[state.domain] : null
    }
  },
  mutations: {
    SET_ISLOADING (state, isLoading) {
      state.isLoading = isLoading
    },
    SET_SHOWCASE (state, showcase) {
      if (state.domain) {
        state.showcases = {
          ...state.showcases,
          [state.domain]: showcase
        }
      }
    },
    SET_DOMAIN (state, domain) {
      state.domain = domain
    }
  },
  plugins: [
    VuexWebExtensions({
      loggerLevel: 'info'
    })
  ]
})
