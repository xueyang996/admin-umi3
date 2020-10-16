// import services from '@/services/index';
import SearchModelType from './interface';

const SearchModel: SearchModelType = {
  namespace: 'optionInfo',
  state: {
    enterpriseId: '',
    enterpriseName: '',
  },
  effects: {
    // *fetchSearch({ payload }, { call }) {
    //   // return yield call(services.fetchSearch, payload);
    // },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default SearchModel;
