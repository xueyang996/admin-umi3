/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import modelExtend from 'dva-model-extend';
import { model } from '@/utils/model';

// import { cloneDeep } from 'lodash';

import pathToRegexp from 'path-to-regexp';
import moment from 'moment';
import { getOptionFromArray } from '@/utils/utils';

import services from '@/services';

import * as CONST from './config/index.js';
import searchTableConfig from './config/tableConfig.js';
import { fetchCommonAsync } from './service';

export default modelExtend(model, {
  namespace: 'mySearchTable',
  state: {
    total: 0,
    current: 1,
    pageSize: CONST.PAGE_SIZE_20,
    showCreate: false,
    deleteWarnModal: false,
    deleteTitle: '',
    deleteId: '',
    createText: '',
    defaultParams: {},
    options: [],
    columns: [],
    currentIds: [],
    tableList: [],
    modalInfo: {},
    createFormInfo: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/searchTable/:type').exec(location.pathname);
        if (match) {
          const type = match[1];
          const config = searchTableConfig[type] || {};
          const { selectOptions: options = [], columns, createFormInfo, fetchUrl } = config;
          dispatch({
            type: 'updateState',
            payload: {
              options,
              columns,
              fetchUrl,
              createFormInfo,
            },
          });
          // const params = location.query || { page: 1 };
          // const defaultParams = cloneDeep(params);
          // const { rangeDate = [] } = config;
          // // 已选择日期
          // if (rangeDate.length > 0 && params[rangeDate[0]]) {
          //   defaultParams.rangeDate = [
          //     moment(params[rangeDate[0]]),
          //     moment(params[rangeDate[1]]),
          //   ];
          // }

          dispatch({
            type: 'queryOption',
            payload: {
              options: config.selectOptions,
            },
          });
        }
      });
    },
  },
  reducers: {
    clear(state, { payload }) {
      return {
        ...payload,
      };
    },
  },
  effects: {
    // 列表中获取数据
    *fetchList({ payload }, { call, put, select }) {
      const { fetchUrl, fetchMethod = 'get', rangeDate, pageSize } = yield select(
        (state) => state.mySearchTable,
      );
      if (payload.rangeDate && payload.rangeDate.length > 0) {
        payload[rangeDate[0]] = moment(payload.rangeDate[0]).format(CONST.DATE_FORMAT);
        payload[rangeDate[1]] = moment(payload.rangeDate[1]).format(CONST.DATE_FORMAT);
      }
      delete payload.rangeDate;
      const { data = {} } = yield call(fetchCommonAsync, {
        url: fetchUrl,
        ...payload,
        method: fetchMethod,
        pageSize,
      });
      const current = Number(payload.page) || 1;
      if (data instanceof Array) {
        yield put({
          type: 'updateState',
          payload: { tableList: data, total: data.length, current },
        });
      } else {
        const { total = 0, records: tableList = [] } = data;
        yield put({
          type: 'updateState',
          payload: { total, current, tableList },
        });
      }
    },
    // 列表中获取数据
    *queryOption({ payload: { options = [] } }, { call, put, select }) {
      for (let index = 0; index < options.length; index++) {
        const item = options[index];
        if (item.optionUrl) {
          const optionAll = yield select((state) => state[CONST.OPTION_INFO]);
          let data = optionAll[item.optionGolbalName];
          if (data) {
            const resultOptions = getOptionFromArray(data, item.transKey);
            item.options = resultOptions;
          } else {
            const dataFetch = yield call(fetchCommonAsync, {
              url: item.optionUrl,
              method: 'get',
            });
            data = dataFetch.data;
            if (!data) {
              // eslint-disable-next-line no-continue
              continue;
            }
            const resultOptions = getOptionFromArray(data, item.transKey);
            item.options = resultOptions;
            yield put({
              type: `${CONST.OPTION_INFO}/updateState`,
              payload: {
                [item.optionGolbalName]: data,
              },
            });
          }
        }
      }
      yield put({ type: 'updateState', payload: { options } });
    },
    *handleTableAction({ payload }, { call, put }) {
      const { service, data } = payload;
      yield call(services[service], data);
      yield put({
        type: 'updateState',
        payload: { modalVisible: false },
      });
      yield put({
        type: 'fetchList',
        payload: {
          page: 1,
        },
      });
    },
    *queryItemInfo({ payload }, { call }) {
      const { service, data } = payload;
      const { data: result = {} } = yield call(services[service], data);
      return result;
    },
    // 删除item
    // *deleteItem(_, { call, put, select }) {
    //   const {
    //     deleteUrl,
    //     deleteId,
    //     deleteMethod,
    //     deleteParams = { deleteId: 'clueId' },
    //   } = yield select(state => state[CONST.TABLE_SEARCH_NAME_SPACE]);
    //   const url = deleteUrl.replace(':id', deleteId);
    //   yield call(fetchCommonAsync, {
    //     url,
    //     deleteId,
    //     deleteParams,
    //     deleteMethod,
    //   });
    //   yield put({
    //     type: 'updateState',
    //     payload: { deleteWarnModal: false, deleteId: '', deleteTitle: '' },
    //   });
    //   yield put({
    //     type: 'fetchList',
    //     payload: {
    //       page: 1,
    //     },
    //   });
    // },
    // *updateModalInfo(
    //   { payload },
    //   {put, select },
    // ) {
    //   if (payload.type === 'create' || payload.type === 'update') {
    //     const totalInfo = yield select(state => state.mySearchTable);
    //     const handleModal = totalInfo[`${payload.type}Modal`];
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         modalVisible: true,
    //         currentModalAction: handleModal,
    //         currentModalData: payload.data || {},
    //         currentTitleModal: handleModal.title,
    //         currentOkText: handleModal.okText,
    //         currentCancelText: handleModal.cancelText,
    //         formItemArray: handleModal.formItemArray,
    //       },
    //     });
    //   }
    // },
  },
});
