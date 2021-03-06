/* eslint-disable no-plusplus */
// 匹配信息
const MATCH_INFO = {
  '80': {
    color: '#00B145',
    showText: '基本符合条件，建议完善关键信息后申请补贴',
    text: '高',
    bgColor: 'rgba(0,177,69,0.08)',
  },
  '20': {
    color: '#4371ff',
    showText: '',
    text: '中',
    bgColor: 'rgba(67,113,255,0.08)',
  },
  '0': {
    color: '#FF4844',
    // percentFontColor: '#8A8A8A',
    showText: '',
    text: '低',
    bgColor: 'rgba(255,72,68,0.08)',
  },
};

/**
 *
 * @param {string} time 获取距离现在的time 天的开始时间、结束时间
 * @param {string} format 要返回的时间格式
 */
export const getMatchInfo = (matchNumber = 0) => {
  const keys = Object.keys(MATCH_INFO)
    .map((item) => parseInt(item, 10))
    // eslint-disable-next-line func-names
    .sort(function (a, b) {
      return b - a;
    });
  let result;
  // eslint-disable-next-line no-plusplus
  for (let index = 0, len = keys.length; index < len; index++) {
    const element = keys[index];
    if (matchNumber > element) {
      result = element;
      break;
    }
  }
  return (
    (result && MATCH_INFO[result]) || {
      text: '不匹配',
      color: 'rgba(136,136,136,1)',
      bgColor: 'rgba(136,136,136,0.08)',
    }
  );
};

export const getVideoImgArray = (mediaContentList: any[]) => {
  const videoImgArray: any[] = [];
  for (let index = 0, len = mediaContentList.length; index < len; index++) {
    const element = mediaContentList[index];
    if (element.vrImgUrl) {
      videoImgArray.push({
        type: 'vr',
        url: element.vrImgUrl,
        vrUrl: element.url[0],
      });
    } else {
      const urls = element.url || [];
      for (let j = 0, { length } = urls; j < length; j++) {
        const url = urls[j];
        videoImgArray.push({
          type: element.type,
          url,
          vrUrl: '',
        });
      }
    }
  }
  return videoImgArray;
};

export type InputType =
  | 'text'
  | 'phone'
  | 'select'
  | 'multiselect'
  | 'selectSearch'
  | 'input'
  | 'checkbox'
  | 'number'
  | 'date';

export const getType = (item: any): InputType => {
  if (item.valueType === 'NUMBER') {
    return 'number';
  }
  if (item.valueType === 'DATE') {
    return 'date';
  }
  if (item.type === 'INPUT_RADIO') {
    return 'select';
  }
  if (item.type === 'INPUT_CHECKBOX') {
    return 'multiselect';
  }
  return 'input';
};

export const getListItem = (item: any) => {
  const type = getType(item);
  const { key, option, required, span } = item;
  return {
    type,
    label: key,
    name: key,
    option,
    span,
    rules: [{ required, message: `${key}不能为空` }],
  };
};
