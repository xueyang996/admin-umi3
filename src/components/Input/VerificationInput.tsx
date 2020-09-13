import React, { useState, FC } from 'react';
import { Input, Button } from 'antd';
import { SearchProps } from 'antd/lib/input';

import styles from './VerificationInput.less';

interface VerficationInputProps extends SearchProps {
  /** 获取验证码的回调 */
  getVerifyCode: () => void;
  value?: string;
  onChange?: (value: string) => void;
}

const VerficationInput: FC<VerficationInputProps> = props => {
  const [btnText, setBtnText] = useState('发送验证码');
  const [btnStatus, setBtnStatus] = useState(false);
  const [code, setCode] = useState('');

  const { getVerifyCode, value, onChange, ...restProps } = props;

  // 处理倒计时
  const handleTimeDown = (
    timer: ReturnType<typeof setTimeout> | null,
    count: number,
  ) => {
    if (timer) {
      clearTimeout(timer);
    }

    if (count <= 0) {
      setBtnText('重新发送');
      setBtnStatus(false);
    } else {
      setBtnText(`${count} s`);

      const newTimer: ReturnType<typeof setTimeout> = setTimeout(() => {
        handleTimeDown(newTimer, count - 1);
      }, 1000);
    }
  };

  // 获取验证码
  const getCode = () => {
    getVerifyCode && getVerifyCode();
    setBtnStatus(true);
    handleTimeDown(null, 60);
  };
  const inputChange = (e: any) => {
    const { value } = e.target;
    onChange && onChange(value);
    setCode(value);
  };

  return (
    <div className={styles.verify}>
      <Input
        {...restProps}
        value={value || code}
        onChange={inputChange}
        suffix={
          <span
            disabled={btnStatus}
            className={styles.verifyBtn}
            onClick={getCode}
          >
            {btnText}
          </span>
        }
      />
    </div>
  );
};

export default VerficationInput;
