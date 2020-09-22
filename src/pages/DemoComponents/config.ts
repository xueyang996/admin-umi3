import { FormItem } from '@/components/MyForm/V4';

export const DEMO_FORM: FormItem[] = [
  {
    type: 'select',
    placeholder: '请选择企业规模',
    label: '企业规模',
    option: [
      { key: '1-50人', value: '1-50人' },
      { key: '50-100人', value: '50-100人' },
      { key: '101-150人', value: '101-150人' },
    ],
    name: 'select',
  },
  {
    type: 'multiselect',
    placeholder: '请选择企业规模复选',
    label: '企业规模复选',
    option: [
      { key: '1-50人', value: '1-50人' },
      { key: '50-100人', value: '50-100人' },
      { key: '101-150人', value: '101-150人' },
    ],
    name: 'multiselect',
  },
  {
    type: 'selectSearch',
    placeholder: '输入关键字',
    label: '远程搜索复选框',
    option: [],
    name: 'selectSearch',
    getOption: (data) => {
      return data.map((item: any) => ({ key: item, value: item }));
    },
    fetchOption: () => {
      return new Promise((resolve) => {
        resolve(['searchData1', 'searchData2']);
      });
    },
    getParams: (value) => value,
  },
  {
    type: 'phone',
    placeholder: '获取验证码',
    hidden: true,
    label: '验证码',
    name: 'code',
  },
  {
    type: 'input',
    placeholder: '隐藏该字段，默认传参值',
    hidden: true,
    value: '默认传参',
    label: '企业资质',
    name: 'input',
  },
  {
    type: 'date',
    placeholder: '输入日期',
    label: '日期',
    name: 'date',
  },
  {
    type: 'number',
    placeholder: '输入数字',
    label: '数字',
    name: 'number',
  },
];
