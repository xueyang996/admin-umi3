import api from './api';
import { genRequest } from './util';

const APIFunction = {};
Object.keys(api).forEach((key: string) => {
  APIFunction[key] = genRequest(api[key]);
});

export default APIFunction;
