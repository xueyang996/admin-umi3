import React, { CSSProperties, useState } from 'react';
// import className from 'classnames';
import {
  Form,
  Select,
  Input,
  InputNumber,
  DatePicker,
  // Switch,
  // Radio,
  // Slider,
  // Button,
  // Upload,
  // Rate,
  Checkbox,
  // Row,
  // Col,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import VertifiCode from '@/components/Input/VerificationInput';
import SelectSearch, { SearchProps } from '@/components/SelectSearch';
import { InputType } from '@/utils/getMatch';

const { Option } = Select;

export type FormItem = {
  type: InputType;
  inputType?: string;
  itemStyle?: CSSProperties;
  label: React.ReactNode | string;
  name: string;
  value?: string;
  dateFormat?: string;
  placeholder?: string;
  option?: { key: string; value: string }[];
  rules?: any[];
  /** 是否可以搜索 */
  showSearch?: boolean;
  /** 是否隐藏字段（依然会收集和校验字段） */
  hidden?: boolean;
  /** 关联选项 */
  childName?: string;
  /** 关联选项 父级 */
  parentName?: string;
  /** 关联选项 子选项 */
  originOption?: { [T: string]: any[] };
  getVerifyCode?: () => void;
  checkPhone?: () => boolean;
};

export interface FormProps {
  list: (FormItem & SearchProps)[];

  form?: FormInstance;
  formItemLayout?: any;
  initialValues?: object;
}
const formItemLayoutDefault = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const nopop = function nopop() {};

function getFormItem(item: FormItem & SearchProps) {
  const {
    type,
    inputType,
    itemStyle,
    label,
    value,
    name,
    option,
    rules,
    placeholder,
    dateFormat,
    showSearch = false,
    getVerifyCode = nopop,
    getOption,
    getParams,
    fetchOption,
    hidden = false,
  } = item;
  switch (type) {
    case 'text':
      return (
        <Form.Item label={label} name={name}>
          <span className="ant-form-text">{value}</span>
        </Form.Item>
      );
    case 'number':
      return (
        <Form.Item label={label} name={name} rules={rules}>
          <InputNumber style={{ width: '100%' }} placeholder={placeholder} />
        </Form.Item>
      );
    case 'date':
      return (
        <Form.Item label={label} name={name} rules={rules}>
          <DatePicker format={dateFormat || 'YYYY/MM/DD'} style={{ width: '100%' }} />
        </Form.Item>
      );
    case 'input':
      return (
        <Form.Item label={label} name={name} rules={rules} hidden={hidden}>
          <Input type={inputType} style={itemStyle} placeholder={placeholder} />
        </Form.Item>
      );
    case 'phone':
      return (
        <Form.Item label={label} rules={rules} name={name} style={{ width: '100%' }}>
          <VertifiCode
            placeholder={placeholder}
            checkPhone={item.checkPhone}
            getVerifyCode={getVerifyCode}
          />
        </Form.Item>
      );
    case 'selectSearch':
      return (
        <Form.Item label={label} rules={rules} name={name} style={{ width: '100%' }}>
          <SelectSearch
            itemStyle={itemStyle}
            placeholder={placeholder}
            fetchOption={fetchOption}
            getOption={getOption}
            getParams={getParams}
          />
        </Form.Item>
      );
    case 'checkbox':
      return (
        <Form.Item label={label} rules={rules} name={name} style={{ width: '100%' }}>
          <Checkbox.Group>
            {option &&
              // eslint-disable-next-line no-shadow
              option.map((item: any) => {
                return (
                  <Checkbox key={item.value || item} value={item.value || item}>
                    {item.key || item}
                  </Checkbox>
                );
              })}
          </Checkbox.Group>
        </Form.Item>
      );
    case 'select':
    case 'multiselect':
      // eslint-disable-next-line no-case-declarations
      const mode = type === 'multiselect' ? 'multiple' : undefined;
      return (
        <Form.Item label={label} name={name} rules={rules}>
          <Select showSearch={showSearch} mode={mode} placeholder={placeholder}>
            {option &&
              // eslint-disable-next-line no-shadow
              option.map((item: any) => {
                return (
                  <Option key={item.value || item} value={item.value || item}>
                    {item.key || item}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
      );
    default:
      return <div />;
  }
}

function MyFormV4(props: FormProps) {
  const {
    list,
    form: formProps,
    formItemLayout = formItemLayoutDefault,
    initialValues = {},
  } = props;
  const [relatedValue, setRelatedValue] = useState('');
  const [formG] = Form.useForm();
  let formResult = formProps;
  if (!formResult) {
    formResult = formG;
  }
  // 对于多选中含有以上均无等选项特殊处理
  const handleValue = (values: any) => {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      const { type, name, childName } = element;
      const value = values[name];
      if (type === 'multiselect' && value) {
        // eslint-disable-next-line no-shadow
        const index = value.indexOf('以上均无');
        if (index === 0 && value.length > 1) {
          value.shift();
          formResult?.setFieldsValue({
            [name]: value,
          });
        } else if (index > 0) {
          formResult?.setFieldsValue({
            [name]: ['以上均无'],
          });
        }
        if (index !== -1) {
          break;
        }
      }
      // 关联选型  父级值发生变化
      if (childName && value) {
        setRelatedValue(value);
        formResult?.setFieldsValue({
          [childName]: undefined,
        });
      }
    }
  };
  return (
    <div>
      <Form
        onValuesChange={handleValue}
        form={formResult}
        {...formItemLayout}
        initialValues={initialValues}
      >
        {list.map((item: FormItem) => {
          if (item.parentName && relatedValue) {
            // eslint-disable-next-line no-param-reassign
            item.option = item.originOption![relatedValue];
          }
          return <div key={item.name}>{getFormItem(item)}</div>;
        })}
      </Form>
    </div>
  );
}

export default MyFormV4;
