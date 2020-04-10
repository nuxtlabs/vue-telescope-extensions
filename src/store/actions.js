
import * as types from './mutation-types';

export const setData = ({ commit }, payload) => {
  commit(types.SET_DATA, payload);
};

export const setIsLoading = ({ commit }, payload) => {
  commit(types.SET_ISLOADING, payload);
};

export const setCurrentDomain = ({ commit }, payload) => {
  commit(types.SET_CURRENTDOMAIN, payload);
};

