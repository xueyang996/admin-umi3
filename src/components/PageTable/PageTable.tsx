import React, { useState, useEffect, FC } from 'react';
import { Table, Button, message } from 'antd';
// import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterOptions from './FilterOptions';
import { IPageTableProps } from './interface';

import styles from './index.less';

const PageTable: FC<IPageTableProps<any>> = (props) => {
  const {
    total,
    tableList,
    uniqueKey,
    getTableList,
    children,
    pageTitle,
    columns,
    filters = [],
    showCreate,
    createTitle,
    createCallback,
    exportCallback,
    needExport,
    defaultCondtions = {},
    needRefresh,
  } = props;

  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchConditons, setSearchConditions] = useState(defaultCondtions);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const refreshTableList = () => {
    getTableList({
      pageNum,
      pageSize,
      ...searchConditons,
    });
  };
  useEffect(() => {
    refreshTableList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, pageSize, searchConditons]);

  useEffect(() => {
    if (needRefresh) {
      refreshTableList();
    }
  }, [needRefresh]);

  const changePageNumAndSize = ({ num = pageNum, size = pageSize }) => {
    setPageNum(num);
    setPageSize(size);
  };

  const nColumns = columns.map((item: any) => ({
    dataIndex: item.key,
    ...item,
  }));

  const handleSearchConditions = (data: any) => {
    setSearchConditions({ ...searchConditons, ...data });
    setPageNum(1);
    setPageSize(10);
  };

  // const renderChildren = () => {
  //   const childrenComponent = React.Children.map(children, child => {
  //     return React.cloneElement(child, {
  //       refreshList: refreshTableList,
  //     });
  //   });

  //   return childrenComponent;
  // };

  const onSelectChange = (selectRowKeys: any) => {
    setSelectedRowKeys(selectRowKeys);
  };

  const rowSelection = needExport
    ? {
        selectedRowKeys,
        onChange: onSelectChange,
      }
    : undefined;

  const handleExport = () => {
    if (selectedRowKeys.length === 0) {
      message.error('请先选择要导出的数据');
    } else if (exportCallback) {
      exportCallback(selectedRowKeys);
    }
  };

  const handleCreate = () => {
    if (createCallback) {
      createCallback(searchConditons);
    }
  };

  return (
    // <PageHeaderWrapper>
    <div className={styles.pageTable}>
      <h3 className={styles.pageTitle}>{pageTitle}</h3>
      <div className={styles.pageFilters}>
        <div className={styles.filters}>
          <FilterOptions
            defaultCondtions={defaultCondtions}
            filters={filters}
            setFilterOpts={handleSearchConditions}
          />
        </div>

        {needExport ? (
          <Button className={styles.plus} onClick={handleExport} style={{ marginRight: '10px' }}>
            导出
          </Button>
        ) : null}

        {showCreate ? (
          <Button type="primary" className={styles.plus} onClick={handleCreate}>
            {createTitle}
          </Button>
        ) : null}
      </div>

      <Table
        bordered
        rowKey={(record) => record[`${uniqueKey}`]}
        columns={nColumns}
        dataSource={tableList}
        rowSelection={rowSelection}
        scroll={{ x: 1132 }}
        size="middle"
        pagination={{
          total,
          showQuickJumper: true,
          showTotal: (showTotal) => `共有${showTotal}条数据满足条件`,
          onChange: (page, size) => changePageNumAndSize({ num: page, size }),
          pageSize: 10,
          defaultCurrent: 1,
        }}
      />
      {children}
    </div>
    // </PageHeaderWrapper>
  );
};

PageTable.defaultProps = {
  filters: [],
  showCreate: false,
  needRefresh: false,
  needExport: false,
  uniqueKey: 'id',
};

export default PageTable;
