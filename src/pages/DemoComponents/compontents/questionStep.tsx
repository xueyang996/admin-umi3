import React, { useState } from 'react';
import { Button } from 'antd';
import QuestionForm, { QuestionItem } from '@/components/questionForm';

import styles from './questionStep.less';

const data: QuestionItem[] = [
  { type: 'INPUT_TEXT_NORMAL', key: 'step1' },
  {
    type: 'INPUT_RADIO',
    key: 'step2',
    option: [
      { label: 'test1', value: '1' },
      { label: 'test2', value: '2' },
    ],
  },
  {
    type: 'INPUT_CHECKBOX',
    key: 'step3',
    option: [
      { label: 'test1', value: '1' },
      { label: 'test2', value: '2' },
      { label: '以上均无', value: '以上均无' },
    ],
  },
  { type: 'INPUT_TEXT_NORMAL', key: 'step4' },
  { type: 'INPUT_TEXT_NORMAL', key: 'step5' },
];
export default () => {
  const initList: QuestionItem[] = [data[0]];
  const [resetStep, setResetStep] = useState(false);
  const [percent, setPercent] = useState(20);
  const [questionlist, setQuestionList] = useState(initList);

  const resetStepF = () => {
    setResetStep(true);
    setTimeout(() => {
      setResetStep(false);
    }, 100);
  };
  const onSubmit = () => {
    const len = questionlist.length;
    setPercent(percent + 20);
    setQuestionList(data.slice(0, len + 1));
  };
  return (
    <div className={styles['demo-container']}>
      <Button onClick={resetStepF}>重置step</Button>
      <QuestionForm
        percent={percent}
        list={questionlist}
        onChange={onSubmit}
        resetStep={resetStep}
      />
    </div>
  );
};
