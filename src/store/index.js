import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loading: false,
        response: null,
    },
    mutations: {
        isLoading(state, loading) {
            state.loading = loading
        },
        setResponse(state, response) {
            state.response = response
        }
    },
    getters: {
        loading: state => {
            return state.loading
        },
        response: state => {
            return state.response
        }
    },

})
