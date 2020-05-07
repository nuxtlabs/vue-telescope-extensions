"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const vuex_1 = require("vuex");
const vuex_webextensions_1 = require("vuex-webextensions");
const types = require("./mutation-types");
const actions = require("./actions");
vue_1.default.use(vuex_1.default);
exports.default = new vuex_1.default.Store({
    state: {
        dataInfo: {},
        isLoading: false,
        currentDomain: '',
    },
    getters: {
        dataInfo(state) { return state.dataInfo; },
        isLoading(state) { return state.isLoading; },
        currentDomain(state) { return state.currentDomain; },
    },
    mutations: {
        [types.SET_DATAINFO](state, payload) {
            state.dataInfo = payload;
        },
        [types.SET_ISLOADING](state, payload) {
            state.isLoading = payload;
        },
        [types.SET_CURRENTDOMAIN](state, payload) {
            state.currentDomain = payload;
        },
    },
    actions,
    plugins: [
        vuex_webextensions_1.default({
            persistentStates: ['dataInfo', 'isLoading', 'currentDomain'],
            loggerLevel: 'verbose',
        }),
    ],
});
