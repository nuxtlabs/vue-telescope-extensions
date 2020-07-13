import Vue from 'vue'
import Vuex from 'vuex'
import VuexWebExtensions from 'vuex-webextensions'
import * as types from './mutation-types'
import * as actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dataInfo: {},
    isLoading: false,
    currentDomain: ''
  },
  getters: {
    dataInfo (state) { return state.dataInfo },
    isLoading (state) { return state.isLoading },
    currentDomain (state) { return state.currentDomain }
  },
  mutations: {
    [types.SET_DATAINFO] (state, payload) {
      state.dataInfo = payload
    },
    [types.SET_ISLOADING] (state, payload) {
      state.isLoading = payload
    },
    [types.SET_CURRENTDOMAIN] (state, payload) {
      state.currentDomain = payload
    }
  },
  actions,
  plugins: [
    VuexWebExtensions({
      persistentStates: ['dataInfo', 'isLoading', 'currentDomain'],
      loggerLevel: 'info'
    })
  ]
})
