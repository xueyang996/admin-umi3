import { request } from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

const PREFIX =
  process.env.NODE_ENV === 'development'
    ? '/api/login/account'
    : 'http://yapi.ii-ai.tech/mock/359/login';
export async function fakeAccountLogin(params: LoginParamsType) {
  return request(PREFIX, {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/login/outLogin');
}
