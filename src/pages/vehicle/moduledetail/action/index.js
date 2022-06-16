import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Popconfirm, Radio, Modal } from 'antd';
import AutoScale from 'components/AutoScale';
import { Link, history } from 'umi'
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';
import AddFrom from './components/AddFrom';

const VehicleAction = function ({ windowInnerHeight }) {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'vehicleAction/save', payload });
  const dictPage = (payload) => dispatch({ type: 'vehicleAction/dictPage', payload });
  // const dictAdd = (payload) => dispatch({ type: 'vehicleModuleList/dictAdd', payload });
  // const dictUpdate = (payload) => dispatch({ type: 'vehicleModuleList/dictUpdate', payload });
  // const dictDel = (payload) => dispatch({ type: 'vehicleModuleList/dictDel', payload });

  const { isAdd, storeData, visible, params, ruleData, addFormvisible } = useSelector(
    (models) => models.vehicleAction,
  );

  const [selectKeys, setSelectKeys] = useState([]);
  const { confirm } = Modal;
  const [selForm] = Form.useForm();
  useEffect(() => {
    dictPage();
  }, [params]);

  // const toTree = (arr, parentId) => {
  //   function loop(parentIds) {
  //     const res = [];
  //     for (let i = 0; i < arr.length; i += 1) {
  //       const item = arr[i];
  //       if (item.parentId === parentIds) {
  //         item.children = loop(item.id);
  //         res.push(item);
  //       }
  //     }
  //     return res.length === 0 ? undefined : res;
  //   }
  //   return loop(parentId);
  // };
  // const tree = toTree(ruleData, '0')?.filter((item) => {
  //   return item.layer === 0;
  // });
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectKeys(selectedRowKeys);
    },
  };

  const showConfirm = () => {
    confirm({
      title: '是否删除？',
      icon: <ExclamationCircleOutlined />,
      onOk() {},
    });
  };

  const columns = [
    {
      title: '序号',
      render: (text, record) => <a>{record.supplierName}</a>,
    },
    {
      title: '动作组名称',
      dataIndex: 'operationName',
      key: 'operationName',
    },
    {
      title: '描述',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      dataIndex: 'address',
      align: 'center',
      width: 250,
      render: (tex, rec) => {
        return (
          <div className="operate">
            <Button
              icon={<FormOutlined />}
              size="small"
              className="editButton"
              onClick={() => {
                saveModelsState({
                  // isAdd: false,
                  visible: true,
                  // storeData: {
                  //   ...rec,
                  // },
                });
              }}
            >
              配置
            </Button>
            <Popconfirm
              title="是否删除？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                // dictDel({ ids: [rec.id] });
              }}
            >
              <Button icon={<DeleteOutlined />} size="small" className="delButton">
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const onFinishSel = () => {
    selForm.validateFields().then((values) => {
      const valueForm = {};
      for (const [key, value] of Object.entries(values)) {
        if (value !== '') {
          valueForm[key] = value;
        } else {
          valueForm[key] = undefined
        }
      }
      saveModelsState({
        params: { ...params, ...valueForm },
      });
    });
  };

  return (
    <div className={styles.container}>
      <BreadcrumbStyle aheadTitle={[{ title: '模块管理' }, { title: '详情' }]} currentTitle="动作" />
      <div className={styles.middleBox}>
        <div className={styles.middleBoxButton}>
          <div className={styles.listIcon}>
            <Radio.Group defaultValue="action" buttonStyle="solid">
            <Link to={{
                pathname: '/vehicle/moduledetail/attribute',
                search: `?agvId=${history?.location?.query?.agvId}`
              }}>
                <Radio.Button value="attribute">属性</Radio.Button>
              </Link>
              <Radio.Button className={styles.detailtabradio} value="action">动作</Radio.Button>
            </Radio.Group>
          </div>
          <div className={styles.buttonFlex}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="addButton"
              onClick={() => {
                saveModelsState({
                  addFormvisible: true,
                });
              }}
            >
              新增
            </Button>
          </div>
        </div>
        <p className={styles.splitLine} />
        <div className={styles.tableBox}>
          <div className={styles.tableStyles}>
            <Table
              columns={columns}
              dataSource={ruleData}
              scroll={{ y: windowInnerHeight - 380 }}
              rowSelection={{ ...rowSelection }}
              rowKey={(record) => record.id}
            />
            <Button
              type="primary"
              className={styles.paginationStyle}
              icon={<DeleteOutlined />}
              onClick={showConfirm}
              disabled={!selectKeys?.length}
            >
              批量删除
            </Button>
          </div>
        </div>
      </div>
      <ModalFrom
        saveModelsState={saveModelsState}
        visible={visible}
        isAdd={isAdd}
        storeData={storeData}
      />
      <AddFrom
        saveModelsState={saveModelsState}
        addFormvisible={addFormvisible}
        isAdd={isAdd}
        storeData={storeData}
      />
    </div>
  );
};

export default AutoScale(VehicleAction);
