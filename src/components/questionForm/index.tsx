/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
import React, { CSSProperties, useEffect, useState } from 'react';
import { Form, Radio, Input, InputNumber, Checkbox, Button, Spin, message, DatePicker } from 'antd';
import classNames from 'classnames';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { isNotEmptyFormValue } from '@/utils/utils';
import { FormInstance } from 'antd/lib/form';

import moment from 'moment';

import styles from './index.less';

export type QuestionItem = {
  type: string;
  valueType?: string;
  // label: React.ReactNode | string;
  // name: string;
  key: string;
  value?: string;
  dateFormat?: string;
  placeholder?: string;
  option?: { label: string; value: string }[] | string[];
};

const DATE_DEFAULT = 'YYYY/MM/DD';

export const getResult = (allValues: any, date?: string) => {
  const result = {};
  Object.keys(allValues).forEach((element) => {
    const item = allValues[element];
    if (moment.isMoment(item)) {
      result[element] = item.format(date || DATE_DEFAULT);
    } else {
      result[element] = item;
    }
  });
  return result;
};

const getItem = (props: QuestionItem) => {
  const { type, placeholder, option = [], valueType, dateFormat } = props;
  let node = <div />;
  const commonStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    marginLeft: 0,
  };
  switch (type) {
    // 输入框
    case 'INPUT_TEXT_NORMAL':
    case 'INPUT_TEXT_POP':
      if (valueType === 'NUMBER') {
        node = <InputNumber style={{ width: '100%' }} placeholder={placeholder || '请输入'} />;
      } else {
        node = <Input placeholder={placeholder || '请输入'} />;
      }
      break;

    // 单选框
    case 'INPUT_RADIO':
      // // date 日期
      // case 'DATE':
      if (valueType === 'DATE') {
        node = <DatePicker format={dateFormat || DATE_DEFAULT} style={{ width: '100%' }} />;
      } else {
        node = (
          <Radio.Group>
            {option.map((item: any) => (
              <Radio key={item.label || item} style={commonStyle} value={item.value || item}>
                {item.label || item}
              </Radio>
            ))}
          </Radio.Group>
        );
      }
      break;

    // 多选框
    case 'INPUT_CHECKBOX':
      node = (
        <Checkbox.Group>
          {option.map((item: any) => (
            <Checkbox key={item.label || item} style={commonStyle} value={item.value || item}>
              {item.label || item}
            </Checkbox>
          ))}
        </Checkbox.Group>
      );
      break;
    default:
      break;
  }
  return node;
};

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
export interface QuestionProps {
  list: QuestionItem[];
  onChange?: (params: any, params1: any) => void;
  percent: number;
  nextBtnType?: 'link' | 'text' | 'ghost' | 'default' | 'primary' | 'dashed';
  itemStyle?: CSSProperties;
  btnStyle?: CSSProperties;
  showSave?: boolean;
  resetStep?: boolean;
  form?: FormInstance;
}
const QuestionForm = (props: QuestionProps) => {
  const {
    list = [],
    onChange,
    percent,
    nextBtnType = 'default',
    itemStyle,
    btnStyle,
    showSave = false,
    form,
    resetStep,
  } = props;
  let formResult = form;
  const [formG] = Form.useForm();
  if (!formResult) {
    formResult = formG;
  }
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formValues, setFromValues] = useState({ changedValues: {}, allValues: {} });
  useEffect(() => {
    if (resetStep) {
      setCurrentStep(0);
    }
  }, [resetStep]);
  const getNextQuestion = (changedValues: any, allValues: any) => {
    if (currentStep === list.length - 1) {
      if (onChange) {
        const allValuesResult = getResult(allValues);
        onChange(changedValues, allValuesResult);
      }
      if (percent !== 100) {
        setLoading(true);
      }
    }
  };
  // 点击上一步，下一步操作
  // type 类型为radio时，由于直接进行请求，此时 formValues 值暂未更新，因此需要单独传入
  const handleStep = (type: string, changedValues?: any, allValues?: any) => {
    const nextFlag = type === 'next';
    if (nextFlag) {
      // 修改值不能为空
      const value1 = changedValues || formValues.changedValues;
      const value2 = allValues || formValues.allValues;
      // 获取当前问题答案
      const key = list[currentStep] && list[currentStep].key;
      const notEmptyValue = key && value2[key];
      // const emptyFlag =
      //   (notEmptyValue && notEmptyValue.length) ||
      //   typeof notEmptyValue === 'number';
      const emptyFlag = isNotEmptyFormValue(notEmptyValue);
      if (!emptyFlag) {
        message.error('录入值不能为空');
        return;
      }
      getNextQuestion(value1, value2);
    }
    const unit = nextFlag ? 1 : -1;
    if (percent === 100 && nextFlag && currentStep === list.length - 1) {
      message.success('已匹配完成！');
    } else {
      setCurrentStep(currentStep + unit);
    }
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    const changedKey = Object.keys(changedValues)[0] || '';
    let changeValue = changedValues[changedKey] || [];
    const changeItem = list.find((item) => item.key === changedKey) || { type: '' };
    if (changeItem.type === 'INPUT_CHECKBOX' && changeValue.length > 0) {
      // 对于多选中含有以上均无等选项特殊处理
      const index = changeValue.indexOf('以上均无');
      if (index === 0 && changeValue.length > 1) {
        changeValue.shift();
      } else if (index > 0) {
        changeValue = ['以上均无'];
      }
      formResult!.setFieldsValue({
        [changedKey]: changeValue,
      });
      changedValues[changedKey] = changeValue;
      allValues[changedKey] = changeValue;
    }
    setFromValues({
      changedValues,
      allValues,
    });
    // INPUT_RADIO 直接跳转下一步

    if (changeItem.type === 'INPUT_RADIO' && !showSave) {
      handleStep('next', changedValues, allValues);
    }
  };

  useEffect(() => {
    if (list.length > currentStep || percent === 100) {
      setLoading(false);
    }
    // 暂无更多，但是已经进入下一步，需要回退到上一步
    if (list.length === currentStep && percent === 100) {
      setCurrentStep(currentStep - 1);
      message.success('已匹配完成！');
    }
  }, [list.length, percent]);

  return (
    <div className={styles.container}>
      <Spin spinning={loading || false} tip="匹配中" delay={100}>
        {loading && <div className={styles['form-item']} style={{ height: '200px' }} />}
        <Form
          {...layout}
          className={styles['questions-form']}
          onValuesChange={onValuesChange}
          form={formResult}
        >
          {list.map((item, index) => {
            return (
              <Form.Item
                className={classNames(styles['form-item'], {
                  [styles.current]: index === currentStep && !showSave,
                  [styles['height-auto']]: showSave,
                })}
                style={itemStyle}
                key={`item${index}`}
                colon={false}
                name={item.key}
                label={`${index + 1}. ${item.key} ?`}
                // required={true}
              >
                {getItem(item)}
              </Form.Item>
            );
          })}
        </Form>
        {!showSave && (
          <div className={styles['handle-parent']} style={btnStyle}>
            <Button
              disabled={currentStep === 0}
              style={{ marginRight: '12px' }}
              onClick={() => {
                handleStep('prev');
              }}
            >
              <LeftOutlined
                style={{
                  fontSize: '10px',
                  color: currentStep === 0 ? 'rgba(132,143,157,0.2)' : '',
                }}
              />
              上一步
            </Button>
            <Button
              type={nextBtnType}
              onClick={() => {
                handleStep('next');
              }}
            >
              下一步
              <RightOutlined
                style={{
                  fontSize: '10px',
                }}
              />
            </Button>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default QuestionForm;
