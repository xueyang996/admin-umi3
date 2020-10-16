import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { connect } from 'dva';
import PageTable from '@/components/PageTable';
import MyForm from '@/components/MyForm/V4';

// import DeclareExModal from './DeclareExModal';
import { Form, Modal, Spin } from 'antd';
// import moment from 'moment';
import { history } from 'umi';

// import searchOption from './config';
import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const getParams = (params: object, record: any) => {
  // 参数处理
  const data = {};
  Object.keys(params).forEach((key) => {
    data[key] = record[params[key]];
  });
  return data;
};
type ModalInfo = {
  modalTitle: string;
  layout?: any;
  list: any[];
  tipText?: string;
  okText?: string;
  cancelText?: string;
  service?: string;
};
export interface TableProps {
  modalInfo: ModalInfo;
  createFormInfo: ModalInfo;
  tableList: any[];
  columns: any[];
  modalVisible: boolean;

  pageTitle: string;
  tableId: number;
  createText: string;
  createLink: string;
  showCreate: boolean;
  total: number;
  spinLoading: boolean;
  options: any[];
  pageSize: number;
  defaultParams: object;
  deleteItem: string;
  rangeDate: string;
  getTableList: (params: any) => Promise<any>;
  getItemInfo: (params: any) => Promise<any>;
  updateState: (params: any) => Promise<any>;
  handleTableAction: (params: any) => Promise<any>;
  // 更新弹窗中字段
  location: any;
  GLOBAL_OPTION: any;
  typeText: string;
}

export const SearchTable: React.FC<TableProps> = (props) => {
  const {
    tableList = [],
    columns = [],
    modalVisible,
    modalInfo,
    showCreate,
    createFormInfo,
    createLink,
    pageTitle,
    // tableId,
    total,
    spinLoading,
    getTableList,
    updateState,
    handleTableAction,
    options = [],
    getItemInfo,
    GLOBAL_OPTION,
    location,
  } = props;
  const [form] = Form.useForm();

  // 更新弹窗信息
  const openUpdateModal = (record: any, item: any) => {
    const { params, list } = item;
    const formValue: any = getParams(params, record);
    const formList = list.map((itemList: any) => {
      const { optionGolbalName } = itemList;
      if (optionGolbalName) {
        // eslint-disable-next-line no-param-reassign
        itemList.option = GLOBAL_OPTION[optionGolbalName] || [];
      }
      return itemList;
    });
    updateState({
      modalVisible: true,
      modalInfo: {
        ...item,
        list: formList,
      },
    });
    setTimeout(() => {
      form.setFieldsValue(formValue);
    }, 100);
  };
  const handelAction = (item: any, record: any) => {
    const {
      type,
      text,
      warnText,
      service,
      params,
      target,
      url,
      detailService,
      detailParams,
    } = item;
    if (type === 'delete') {
      Modal.confirm({
        title: text,
        content: warnText,
        onOk() {
          // 参数处理
          const data = getParams(params, record);
          handleTableAction({ service, data });
        },
        onCancel() {},
      });
      // 跳转新页面或者路由
    } else if (type === 'detail') {
      const data = getParams(params, record);
      const query = Object.keys(data)
        .map((key) => {
          return `${key}=${data[key]}`;
        })
        .join('&');
      const path = `${url}?${query}`;
      if (target === 'self') {
        history.push(path);
      } else {
        const { origin } = window.location;
        window.open(`${origin}${path}`, target);
      }
    } else if (type === 'modal') {
      if (detailService) {
        const detailData = getParams(detailParams, record);
        getItemInfo({ service: detailService, data: detailData }).then((res) => {
          openUpdateModal(res, item);
        });
      } else {
        openUpdateModal(record, item);
      }
    }
  };
  // 新页面重新赋值 有handleConfig的 render
  useEffect(() => {
    columns.forEach((itemColumn: any) => {
      if (itemColumn.handleConfig) {
        // eslint-disable-next-line no-param-reassign
        itemColumn.render = (_: string, record: any) => {
          return (
            <div>
              {itemColumn.handleConfig.map((item: any) => {
                return (
                  <span
                    className={styles['handle-item']}
                    style={item.style}
                    key={item.text}
                    onClick={() => {
                      handelAction(item, record);
                    }}
                  >
                    {item.text}
                  </span>
                );
              })}
            </div>
          );
        };
      }
    });
  }, [location.pathname]);
  const modalCancel = () => {
    form.resetFields();
    updateState({ modalVisible: false });
  };
  const createCallBack = () => {
    if (createLink) {
      history.push(createLink);
    } else {
      updateState({ formInfo: createFormInfo, modalVisible: true });
    }
  };
  return (
    <Spin spinning={spinLoading || false} tip={(modalInfo && modalInfo.tipText) || '加载中'}>
      <div>
        <PageTable
          total={total}
          pageTitle={pageTitle}
          tableList={tableList}
          getTableList={getTableList}
          columns={columns}
          filters={options}
          showCreate={showCreate}
          createTitle={createFormInfo.modalTitle}
          createCallback={createCallBack}
        />
        <Modal
          forceRender
          visible={modalVisible}
          title={modalInfo.modalTitle}
          okText={modalInfo.okText || '确定'}
          cancelText={modalInfo.cancelText || '取消'}
          onCancel={modalCancel}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                // form.resetFields();
                handleTableAction({ service: modalInfo.service, data: values });
              })
              .catch(() => {});
          }}
        >
          <MyForm form={form} formItemLayout={formItemLayout} list={modalInfo.list || []} />
        </Modal>
      </div>
    </Spin>
  );
};

const mapStateToProps = ({
  mySearchTable,
  optionInfo,
}: {
  mySearchTable: TableProps;
  optionInfo: any;
}) => {
  return { ...mySearchTable, GLOBAL_OPTION: optionInfo };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    getTableList: (params: any) => dispatch({ type: 'mySearchTable/fetchList', payload: params }),
    getItemInfo: (params: any) =>
      dispatch({ type: 'mySearchTable/queryItemInfo', payload: params }),
    updateState: (params: any) => dispatch({ type: 'mySearchTable/updateState', payload: params }),
    handleTableAction: (params: any) =>
      dispatch({ type: 'mySearchTable/handleTableAction', payload: params }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchTable);
