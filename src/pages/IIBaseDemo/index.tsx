import React from 'react';
import { InputVerify, SelectSearch, MyUpload } from 'ii-admin-base';

export default function Demo() {
  return (
    <div style={{ background: '#fff', minHeight: '80vh' }}>
      <InputVerify placeholder="请输入四位验证码" sendCode={() => {}} onChange={() => {}} />
      <SelectSearch
        placeholder="请输入搜索关键字"
        itemStyle={{ width: '400px' }}
        getOption={(data) => {
          return data.map((item: any) => ({ key: item, value: item }));
        }}
        fetchOption={() => {
          return new Promise((resolve) => {
            // eslint-disable-next-line radix
            const len = Math.ceil(Math.random() * 10) + 1;
            const result = [];
            for (let i = 0; i < len; ) {
              result.push(`searchData${i + 1}`);
              i += 1;
            }
            resolve(result);
          });
        }}
        getParams={(value) => value}
      />
      <div>
        <MyUpload
          style={{ textAlign: 'center' }}
          extra={['支持扩展名：.word .pdf', '建议上传30M以内大小的PDF文件']}
          describe="点击或将PDF拖拽到这里上传"
        />
      </div>
    </div>
  );
}
