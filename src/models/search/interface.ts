import { Reducer } from 'umi';

interface SearchModelState {}

interface SearchModelType {
  namespace: string;
  state: SearchModelState;
  effects: {
    // fetchSearch: Effect;
  };
  reducers: {
    updateState: Reducer;
  };
}

export default SearchModelType;
