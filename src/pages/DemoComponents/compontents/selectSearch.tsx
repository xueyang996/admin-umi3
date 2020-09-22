import React from 'react';
import SelectSearch from '@/components/SelectSearch';

export default () => {
  return (
    <div>
      <h3>select 远程搜索</h3>
      <SelectSearch
        placeholder="请输入搜索关键字"
        itemStyle={{ width: '400px' }}
        getOption={(data) => {
          return data.map((item: any) => ({ key: item, value: item }));
        }}
        fetchOption={() => {
          return new Promise((resolve) => {
            resolve(['searchData1', 'searchData2']);
          });
        }}
        getParams={(value) => value}
      />
    </div>
  );
};
