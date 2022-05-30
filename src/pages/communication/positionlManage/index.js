import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Popconfirm } from 'antd';
import MultipleSel from 'components/MultipleSel';
import AutoScale from 'components/AutoScale';
import Iconfont from 'components/Iconfont';
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  FormOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';

const Home = function () {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'positionlManage/save', payload });
  const dictPage = (payload) => dispatch({ type: 'positionlManage/dictPage', payload });
  const dictAdd = (payload) => dispatch({ type: 'positionlManage/dictAdd', payload });
  const dictUpdate = (payload) => dispatch({ type: 'positionlManage/dictUpdate', payload });
  const dictDel = (payload) => dispatch({ type: 'positionlManage/dictDel', payload });
  const dictTaskStates = (payload) => dispatch({ type: 'positionlManage/dictTaskStates', payload });
  const dictAgvModel = (payload) => dispatch({ type: 'positionlManage/dictAgvModel', payload });
  const dictMapList = (payload) => dispatch({ type: 'positionlManage/dictMapList', payload });
  const dictIssue = (payload) => dispatch({ type: 'positionlManage/dictIssue', payload });
  const dictTaskType = (payload) => dispatch({ type: 'positionlManage/dictTaskType', payload });

  const { isAdd, storeData, visible, params, ruleData, taskStates, agvModelList, taskTypeList, agvPositonList } = useSelector(
    (models) => models.positionlManage,
  );
  const [selectKeys, setSelectKeys] = useState([]);

  const [selForm] = Form.useForm();
  useEffect(() => {
    dictTaskStates()
    dictTaskType()
    dictAgvModel()
    dictPage();  
    dictMapList()
  }, [params]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectKeys(selectedRowKeys);
    },
  };

  const showConfirm = () => {
    confirm({
      title: '是否删除？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        console.log(selectKeys)
      },
    });
  };

  const columns = [
    {
      title: '序号',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 100,  
      dataIndex: 'index',
      fixed: 'left',
    },
    {
      title: '设备',
      dataIndex: 'taskCode',
      key: 'taskCode',
      width: 200,
      flag: true,
      fixed: 'left',
    },
    {
      title: '描述',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      type: 'number'
    },
    {
      title: '点位',
      dataIndex: 'taskType',
      key: 'taskType',
      width: 100,
      render: (text) =>{
        const showState = taskTypeList.find(item=> text === item.key)
        return showState?.value
      },
      showOption:{
        key: 'key',
        content: 'value'
      },
      data: taskTypeList
    },
    {
      title: '数据类型',
      dataIndex: 'startPositionName',
      key: 'startPositionName',
      width: 200,
    },
    {
      title: '期望值',
      dataIndex: 'endPositionName',
      key: 'endPositionName',
      width: 200,
    },
    {
      title: '当前值',
      dataIndex: 'expectedAgvModelId',
      key: 'expectedAgvModelId',
      width: 150,
      render: (text) =>{
        const showState = agvModelList.find(item=> text === item.key)
        return showState?.value
      },
      showOption:{
        key: 'key',
        content: 'value'
      },
      data: agvModelList
    },
    {
      title: '数据流向',
      dataIndex: 'taskState',
      key: 'taskState',
      flag: true,
      width: 100,
      render: (text) =>{
        const showState = taskStates.find(item=> text === item.key)
        return showState?.value
      },
      showOption:{
        key: 'key',
        content: 'value'
      },
      data: taskStates
    },
    {
      title: '操作',
      dataIndex: 'address',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (tex, rec) => {
        return (
          <div className="operate">
             <Button
              icon={<FormOutlined />}
              size="small"
              className="editButton"
              onClick={() => {
                saveModelsState({
                  isAdd: false,
                  visible: true,
                  storeData: {
                    ...rec,
                  },
                });
              }}
            >
              修改
            </Button> 
            <Popconfirm
              title="是否删除？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                dictDel({ id: rec.id });
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
        }
      }
      saveModelsState({
        params: { ...valueForm },
      });
    });
  };

  return (
    <div className={styles.container}>
      <BreadcrumbStyle aheadTitle={[{ title: '互联通信' }]} currentTitle="交互点位配置" />
      <div className={styles.middleBox}>
        <div className={styles.middleBoxButton}>
          <div className={styles.listIcon}>
            <Iconfont iconMode="unicode" type="icon-gold" className="prefixIcon" />
            交互点位配置列表
          </div>
          <div className={styles.buttonFlex}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="addButton"
              onClick={() => {
                saveModelsState({
                  visible: true,
                  isAdd: true,
                  storeData: {}
                });
              }}
            >
              新增
            </Button>
          </div>
        </div>
        <p className={styles.splitLine} />
        <div className={styles.tableBox}>
          <div className={styles.searchForm}>
            {/* ↓该组件自行实现，现有组件有bug */}
            <MultipleSel
              selForm={selForm}
              columns={columns}
              selButton={
                <>
                  <Button
                    className="buttonStyle"
                    type="primary"
                    onClick={() => {
                      onFinishSel();
                    }}
                    icon={<SearchOutlined />}
                  >
                    搜索
                  </Button>
                </>
              }
            />
          </div>
          <div className={styles.tableStyles}>
            <Table
              columns={columns}
              dataSource={ruleData}
              scroll={{scrollToFirstRowOnChange: true,x: 1000}}
              rowSelection={{ ...rowSelection }}
              rowKey={(record) => record.id}
            />
          </div>
        </div>
      </div>
      <ModalFrom
        saveModelsState={saveModelsState}
        dictAdd={dictAdd}
        dictUpdate={dictUpdate}
        taskStates={taskStates}
        visible={visible}
        isAdd={isAdd}
        storeData={storeData}
        agvModelList={agvModelList}
        agvPositonList={agvPositonList}
        dictMapList={dictMapList}
        taskTypeList={taskTypeList}
      />
    </div>
  );
};

export default AutoScale(Home);
