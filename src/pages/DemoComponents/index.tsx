import React, { useState } from 'react';
import { Modal, Button, Form } from 'antd';
import MyForm, { FormItem } from '@/components/MyForm/V4';
import VertifyCode from '@/components/Input/VerificationInput';
import ChangePWDModal from '@/components/ChangePWD';

import ChartDemo from './compontents/chart';
import QuestionStep from './compontents/questionStep';
import SelectSearch from './compontents/selectSearch';
import { DEMO_FORM } from './config';

import styles from './index.less';

export default (): React.ReactNode => {
  const initModalInfo: { title: string; list: FormItem[] } = {
    title: '',
    list: [],
  };
  const [form] = Form.useForm();
  const [modalInfo, setModalInfo] = useState(initModalInfo);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPWDVisible, setModalPWDVisible] = useState(false);
  const editModal = (title: string, list: FormItem[], type?: string) => {
    setModalVisible(true);
    setModalInfo({
      title,
      list,
    });
    if (type === 'edit') {
      setTimeout(() => {
        // todo put your change value
        form.setFieldsValue({});
      }, 0);
    }
  };
  const onSubmit = () => {
    form
      .validateFields()
      .then(() => {
        // console.log(values);
        setModalVisible(false);
      })
      .catch(() => {
        // console.log(info, 'sdfsfsdf');
      });
  };
  return (
    <div className={styles['demo-container']}>
      <h3>form demo</h3>
      <Button
        type="primary"
        style={{ marginRight: '10px' }}
        onClick={() => editModal('form表单demo', DEMO_FORM)}
      >
        form表单demo
      </Button>
      <Button type="primary" onClick={() => setModalPWDVisible(true)}>
        修改密码
      </Button>
      <h3>验证码</h3>
      <VertifyCode getVerifyCode={() => {}} />

      <h3>bizcharts图表demo</h3>
      <ChartDemo />
      <h3>问题搜集demo</h3>
      <QuestionStep />

      <SelectSearch />

      <ChangePWDModal
        modalVisible={modalPWDVisible}
        changePWD={() =>
          new Promise((resolve) => {
            resolve({ status: 'success', message: '修改成功' });
          })
        }
        onSucess={() => {
          setModalPWDVisible(false);
        }}
        onCancel={() => {
          setModalPWDVisible(false);
        }}
        sendSms={() =>
          new Promise((resolve) => {
            resolve({ status: 'success', message: '修改成功' });
          })
        }
        inputPhone
      />
      <Modal
        visible={modalVisible}
        title={modalInfo.title}
        onCancel={() => {
          setModalInfo({ title: '', list: [] });
          setModalVisible(false);
        }}
        onOk={onSubmit}
        forceRender
      >
        <MyForm form={form} list={modalInfo.list || []} />
      </Modal>
    </div>
  );
};
