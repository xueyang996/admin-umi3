/* eslint-disable no-param-reassign */
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
  Row,
  Col,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import VertifiCode from '@/components/Input/VerificationInput';
import SelectSearch, { SearchProps } from '@/components/SelectSearch';
import { InputType } from '@/utils/getMatch';

const { Option } = Select;
const { TextArea } = Input;

// 栅格布局时计算每个item的layout
const getLayoutItem = (formItemLayout: any, preSpan: number, span: number) => {
  const formLayoutCopy = JSON.parse(JSON.stringify(formItemLayout));
  // 连续两个都为12 的选项，增加offset
  if (preSpan === 12 && span === 12) {
    formLayoutCopy.labelCol.offset = 2;
    preSpan = 0;
  } else {
    preSpan = span || 0;
  }
  if (span === 24) {
    formLayoutCopy.labelCol.span = Math.ceil((formLayoutCopy.labelCol.span * 12) / span);
    formLayoutCopy.wrapperCol.span = 24 - formLayoutCopy.labelCol.span;
  }
  return [formLayoutCopy, preSpan];
};

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
  allowClear?: boolean;
  /** 是否隐藏字段（依然会收集和校验字段） */
  hidden?: boolean;
  /** 关联选项 */
  childName?: string;
  /** 关联选项 父级 */
  parentName?: string;
  /** 关联选项 子选项 */
  originOption?: { [T: string]: any[] };
  /** form item col 占几部分 */
  span?: number;
  getVerifyCode?: () => void;
  checkPhone?: () => boolean;
  showTime?: boolean;
  disabledDate?: (currentDate: any) => boolean;
};

export interface FormProps {
  list: (FormItem & SearchProps)[];

  form?: FormInstance;
  formItemLayout?: any;
  initialValues?: object;
  /** item 是否col 展示 */
  showCol?: boolean;
}
const formItemLayoutDefault = {
  labelCol: { span: 8 },
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
    option,
    dateFormat,
    showSearch = false,
    getVerifyCode = nopop,
    getOption,
    getParams,
    fetchOption,
    allowClear = false,
    disabledDate,
    showTime,
  } = item;
  let { placeholder } = item;
  if (!placeholder) {
    if (type === 'select' || type === 'multiselect') {
      placeholder = `请选择${label}`;
    } else {
      placeholder = `请输入${label}`;
    }
  }

  switch (type) {
    case 'text':
      return <span className="ant-form-text">{value}</span>;
    case 'number':
      return <InputNumber style={{ width: '100%' }} placeholder={placeholder} />;
    case 'date':
      return (
        <DatePicker
          format={dateFormat || 'YYYY/MM/DD'}
          style={{ width: '100%' }}
          showTime={showTime}
          disabledDate={disabledDate}
        />
      );
    case 'input':
      return <Input type={inputType} style={itemStyle} placeholder={placeholder} />;
    case 'textarea':
      return <TextArea style={itemStyle} placeholder={placeholder} />;
    case 'phone':
      return (
        <VertifiCode
          placeholder={placeholder}
          checkPhone={item.checkPhone}
          getVerifyCode={getVerifyCode}
        />
      );
    case 'selectSearch':
      return (
        <SelectSearch
          itemStyle={itemStyle}
          placeholder={placeholder}
          fetchOption={fetchOption}
          getOption={getOption}
          getParams={getParams}
        />
      );
    case 'checkbox':
      return (
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
      );
    case 'select':
    case 'multiselect':
      // eslint-disable-next-line no-case-declarations
      const mode = type === 'multiselect' ? 'multiple' : undefined;
      return (
        <Select
          allowClear={allowClear}
          showSearch={showSearch}
          mode={mode}
          placeholder={placeholder}
        >
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
      );
    default:
      return <div />;
  }
}

function MyFormV4(props: FormProps) {
  let preSpan = 0;
  const {
    list,
    form: formProps,
    formItemLayout = formItemLayoutDefault,
    initialValues = {},
    showCol = false,
  } = props;
  const initObj: any = {};
  const [relatedValue, setRelatedValue] = useState(initObj);
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
        setRelatedValue({
          ...relatedValue,
          [name]: value,
        });
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
        <Row>
          {list.map((item: FormItem) => {
            if (item.parentName) {
              // eslint-disable-next-line no-param-reassign
              item.option = relatedValue[item.parentName]
                ? item.originOption![relatedValue[item.parentName]]
                : [];
            }
            const { name, label, rules, hidden = false } = item;
            const span = item.span === 24 || !showCol ? 24 : 12;
            let formLayoutCopy;
            if (showCol) {
              [formLayoutCopy, preSpan] = getLayoutItem(formItemLayout, preSpan, span);
            }
            return (
              <Col span={span} key={name}>
                <Form.Item
                  style={{ width: '100%' }}
                  {...formLayoutCopy}
                  label={label}
                  name={name}
                  rules={rules}
                  hidden={hidden}
                >
                  {getFormItem(item)}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>
    </div>
  );
}

export default MyFormV4;
