import * as types from './mutation-types';

export default {
  [types.SET_DATAINFO](state, payload) {
    state.dataInfo = payload;
  },
  [types.SET_ISLOADING](state, payload) {
    state.isLoading = payload;
  },
  [types.SET_CURRENTDOMAIN](state, payload) {
    state.currentDomain = payload;
  },
};
