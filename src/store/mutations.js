import * as types from './mutation-types';

export default {
  [types.SET_DATA](state, payload) {
    state.data = payload;
  },
  [types.SET_ISLOADING](state, payload) {
    state.isLoading = payload;
  },
  [types.SET_CURRENTDOMAIN](state, payload) {
    state.currentDomain = payload;
  },
}