import { request } from 'umi';

export const REG_PARAMS = /{([a-zA-Z]+)}/g;

export const genRequest = (params: any) => {
  // let url = apiPrefix[__API_PREFIX_FLAG__] + params;
  let url = params;
  let method = 'GET';

  const paramsArray = params.split(' ');
  if (paramsArray.length === 2) {
    [method, url] = paramsArray;
    // url = apiPrefix[__API_PREFIX_FLAG__] + paramsArray[1];
    // url = paramsArray[1];
  }

  return function ruest(data: any) {
    let resultUrl = url;
    // 替换url 中 的参数
    let match;
    // eslint-disable-next-line no-cond-assign
    while ((match = REG_PARAMS.exec(url))) {
      if (data[match[1]]) {
        resultUrl = resultUrl.replace(match[0], data[match[1]]);
      }
    }
    // if (data.pageSize) {
    //   let originUrl = url;
    //   resultUrl = originUrl.replace('{pageSize}', data.pageSize).replace('{pageNum}', data.pageNum);
    // } else if() {

    // }
    const sendParams: any = {
      // url: resultUrl,
      data,
      method,
    };
    if (method.toLowerCase() === 'get') {
      sendParams.params = data;
    }
    return request(resultUrl, sendParams);
  };
};
