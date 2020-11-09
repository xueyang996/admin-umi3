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
    type: 'select',
    label: '关联父级',
    name: 'parentCode',
    childName: 'childCode',
    option: [
      { key: '选项一', value: '1' },
      { key: '选项二', value: '2' },
    ],
  },
  {
    type: 'select',
    label: '关联子级',
    name: 'childCode',
    parentName: 'parentCode',
    originOption: {
      '1': [
        { key: '子选项一', value: '子1' },
        { key: '子选项二', value: '子2' },
      ],
      '2': [
        { key: '子选项三', value: '子3' },
        { key: '子选项四', value: '子4' },
      ],
    },
    option: [],
  },
  {
    type: 'phone',
    placeholder: '获取验证码',
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
  {
    type: 'upload',
    label: '上传附件',
    name: 'upload',
    extra: ['支持扩展名：.word .pdf', '建议上传30M以内大小的PDF文件'],
    describe: '点击或将PDF拖拽到这里上传',
    itemStyle: { width: '300px', height: '150px', background: '#fbfdff' },
    rules: [],
  },
];
