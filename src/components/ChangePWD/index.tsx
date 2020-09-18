/* eslint-disable prefer-promise-reject-errors */
import React, { useEffect, useState, FC } from 'react';
import { Form } from 'antd';
import MyForm, { FormItem } from '@/components/MyForm/V4';
import MyModal from '@/components/Modal/CommonModal';

import { validatePWDForm, validatePhoneForm, validatePhone } from '@/utils/vailadate';

export const formPWD: FormItem[] = [
  {
    type: 'text',
    label: '手机号',
    name: 'phone',
    placeholder: '请输入11位手机号',
    itemStyle: { width: '100%', height: '38px' },
  },
  {
    type: 'phone',
    placeholder: '请输入验证码',
    label: '验证码',
    name: 'smsVerifyCode',
    rules: [{ required: true, message: '验证码不能为空' }],
  },
  {
    type: 'input',
    inputType: 'password',
    label: '新密码',
    placeholder: '请输入新密码',
    itemStyle: { width: '100%', height: '38px' },
    name: 'newPassword',
    rules: [{ required: true, message: '新密码不能为空' }, () => ({ validator: validatePWDForm })],
  },
  {
    type: 'input',
    inputType: 'password',
    label: '再次输入',
    placeholder: '请再次输入密码',
    itemStyle: { width: '100%', height: '38px' },
    name: 'newPasswordConfirm',
    rules: [
      {
        required: true,
        message: '确认密码不能为空',
      },
      ({ getFieldValue }: any) => ({
        validator(_: any, value: string) {
          if (!value || getFieldValue('newPassword') === value) {
            return Promise.resolve();
          }
          return Promise.reject('两次密码不一致');
        },
      }),
    ],
  },
];

interface Props {
  /** title 弹窗标题 */
  title?: string;
  /** width 弹窗宽度 */
  width?: string;
  /** onCancel 弹窗点关闭方法 */
  onCancel?: () => void;
  /** onSucess 修改密码成功回调方法 */
  onSucess?: (params: any) => void;
  /** changePWD 修改密码方法 */
  changePWD: (params: any) => Promise<any>;
  /** extraInfo 修改密码额外参数 */
  extraInfo?: object;
  /** modalVisible 弹窗visible */
  modalVisible?: boolean;
  /** list 自定义form字段 */
  list?: FormItem[];
  /** inputPhone 手机号是否为输入 */
  inputPhone?: boolean;
  /** sendSms 发送验证码方法 */
  sendSms?: any;
}
const ChangePWD: FC<Props> = (props) => {
  const {
    title,
    width,
    onCancel,
    extraInfo = {},
    changePWD,
    onSucess,
    modalVisible,
    list,
    inputPhone,
    sendSms,
  } = props;
  const [form] = Form.useForm();
  const [listResult, setListResult] = useState(list || formPWD);
  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
    }
  }, [modalVisible]);
  // list 发短信手机号验证增加等
  useEffect(() => {
    if (!list) {
      if (inputPhone) {
        listResult[0].type = 'input';
        listResult[0].rules = [
          { required: true, message: '手机号不能为空' },
          () => ({ validator: validatePhoneForm }),
        ];
      } else {
        listResult[0].type = 'text';
        listResult[0].rules = [];
      }
      listResult[1].getVerifyCode = () => {
        const value = form.getFieldValue('phone');
        sendSms(value);
      };
      listResult[1].checkPhone = () => {
        const value = form.getFieldValue('phone');
        return validatePhone(value);
        // return false
      };
      setListResult(listResult);
    }
  }, [sendSms, inputPhone, list]);
  const submitForm = () => {
    form
      .validateFields()
      .then((values: any) => {
        changePWD({ ...values, ...extraInfo }).then((res) => {
          // 可能不同项目处理不一致
          if (res.status === 'success') {
            if (onSucess) {
              onSucess(res);
            }
          }
        });
      })
      .catch(() => {
        // console.log(info, 'sdfsfsdf');
      });
  };
  return (
    <MyModal
      title={title}
      width={width || '430px'}
      visible={modalVisible}
      onOk={submitForm}
      onCancel={onCancel}
    >
      <MyForm
        formItemLayout={{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }}
        list={listResult || []}
        form={form}
      />
    </MyModal>
  );
};

export default ChangePWD;
