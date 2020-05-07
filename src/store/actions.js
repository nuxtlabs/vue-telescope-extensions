"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types = require("./mutation-types");
exports.setDataInfo = ({ commit }, payload) => {
    commit(types.SET_DATAINFO, payload);
};
exports.setIsLoading = ({ commit }, payload) => {
    commit(types.SET_ISLOADING, payload);
};
exports.setCurrentDomain = ({ commit }, payload) => {
    commit(types.SET_CURRENTDOMAIN, payload);
};
