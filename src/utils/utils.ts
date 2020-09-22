import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => {
  const { href } = window.location;
  const qsIndex = href.indexOf('?');
  const sharpIndex = href.indexOf('#');

  if (qsIndex !== -1) {
    if (qsIndex > sharpIndex) {
      return parse(href.split('?')[1]);
    }

    return parse(href.slice(qsIndex + 1, sharpIndex));
  }

  return {};
};

/**
 * 判定表单值是否为空值
 * @param {*} formValue 表达值
 * @returns boolean  true: 非控值，false：空值
 */
export const isNotEmptyFormValue = (formValue: any) => {
  return !!(formValue && formValue.length) || typeof formValue === 'number';
};

export function getOptionFromObj(optionObj: any) {
  const result: any[] = [];
  Object.keys(optionObj).map((key: string) => {
    const value = optionObj[key];
    result.push({
      value: /^[0-9]+$/.test(key) ? parseInt(key, 10) : key, // 全为数字是key转化为数字
      label: value,
    });
    return key;
  });
  return result;
}
export function getOptionFromArray(optionsArray: any, transKey: any) {
  if (optionsArray instanceof Array) {
    return optionsArray.map((item) => {
      if (typeof item === 'object') {
        return {
          value: item[transKey.value],
          label: item[transKey.label],
        };
      }
      return {
        value: item,
        label: item,
      };
    });
  }
  return getOptionFromObj(optionsArray);
}
