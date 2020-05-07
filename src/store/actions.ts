
import * as types from './mutation-types';

export const setDataInfo = ({ commit }: any, payload: any) => {
  commit(types.SET_DATAINFO, payload);
};

export const setIsLoading = ({ commit }, payload: boolean) => {
  commit(types.SET_ISLOADING, payload);
};

export const setCurrentDomain = ({ commit }: any, payload: string) => {
  commit(types.SET_CURRENTDOMAIN, payload);
};
