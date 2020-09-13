import React from 'react';
import BasicChart from '@/components/ChartV4/BasicChart';
import MatchStatusChart from '@/components/ChartV4/MatchStatus';

import styles from './chart.less';

export default () => {
  const data = [
    { departmentName: '部门1', number: 10 },
    { departmentName: '部门2', number: 20 },
    { departmentName: '部门3', number: 30 },
    { departmentName: '部门4', number: 40 },
    { departmentName: '部门5', number: 10 },
  ];
  return (
    <div className={styles['demo-container']}>
      <MatchStatusChart sizeCount="30" sizeDes="14" height={110} padding={[0]} data={65} />
      <BasicChart
        data={data}
        type="rect"
        // scale={{
        //   number: {
        //     type:"linear",
        //     min: 0,
        //     minTickInterval: 1
        //   }
        // }}
        sizeGeom={12}
        positionGeom="departmentName*number"
        tooltipGeom={[
          'departmentName*number',
          (name: string, value: string) => {
            // array
            return {
              name,
              value,
            };
          },
        ]}
        typeGeom="interval"
        labelGeom={['number']}
        colorGeo="#73a0fa"
        height={385}
        padding={[30, 20, 100, 50]}
      />
    </div>
  );
};
