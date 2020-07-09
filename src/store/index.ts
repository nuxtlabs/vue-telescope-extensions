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
    dataInfo(state: any): any { return state.dataInfo },
    isLoading(state: any): boolean { return state.isLoading },
    currentDomain(state: any): string { return state.currentDomain }
  },
  mutations: {
    [types.SET_DATAINFO](state: any, payload: any) {
      state.dataInfo = payload
    },
    [types.SET_ISLOADING](state: any, payload: string) {
      state.isLoading = payload
    },
    [types.SET_CURRENTDOMAIN](state: any, payload: string) {
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
