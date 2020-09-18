/* eslint-disable prefer-promise-reject-errors */
/**
 *  验证手机号
 * @param {number} phone
 */
export const validatePhone = (phone: any) => {
  return /^[1][1-9][0-9]{9}$/.test(phone);
};

export const validatePhoneForm = (_: any, value: any) => {
  try {
    if (!value) {
      return Promise.resolve();
    }
    if (validatePhone(value)) {
      return Promise.resolve();
    }
    return Promise.reject('请输入正确的手机格式');
  } catch (err) {
    return Promise.reject('请输入正确的手机格式');
  }
};

/**
 *  验证密码
 * @param {string} password
 */
const validatePWD = (password: string) => {
  return /^[A-Za-z0-9]{6,20}$/.test(password);
};
export const validatePWDForm = (_: any, value: string) => {
  try {
    if (!value) {
      return Promise.resolve();
    }
    if (validatePWD(value)) {
      return Promise.resolve();
    }
    return Promise.reject('请输入6-20位英文字母与数字');
  } catch (err) {
    return Promise.reject('请输入6-20位英文字母与数字');
  }
};
