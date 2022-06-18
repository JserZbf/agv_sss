import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Popconfirm, Select } from 'antd';
import moment from 'moment';
import SearchSel from 'components/SearchSel';
import AutoScale from 'components/AutoScale';
import Iconfont from 'components/Iconfont';
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  FormOutlined,
  DeleteOutlined,
  PlusOutlined,
  RetweetOutlined
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';

const TaskManage = function ({windowInnerHeight}) {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'taskManage/save', payload });
  const dictPage = (payload) => dispatch({ type: 'taskManage/dictPage', payload });
  const dictDel = (payload) => dispatch({ type: 'taskManage/dictDel', payload });
  const dictTaskStates = (payload) => dispatch({ type: 'taskManage/dictTaskStates', payload });
  const dictAgvModel = (payload) => dispatch({ type: 'taskManage/dictAgvModel', payload });
  const dictMapList = (payload) => dispatch({ type: 'taskManage/dictMapList', payload });
  const dictIssue = (payload) => dispatch({ type: 'taskManage/dictIssue', payload });
  const dictTaskType = (payload) => dispatch({ type: 'taskManage/dictTaskType', payload });
  const dictCompare = (payload) => dispatch({ type: 'taskManage/dictCompare', payload });

  const { params, total, priorityList, ruleData, taskStates, agvModelList, taskTypeList, selectKeys } = useSelector(
    (models) => models.taskManage,
  );
  // const [selectKeys, setSelectKeys] = useState([]);
  const [compareValue, setCompareValue] = useState(priorityList[0]?.key);

  const [selForm] = Form.useForm();
  useEffect(() => {
    dictTaskStates()
    dictTaskType()
    dictAgvModel()
    dictPage();  
    dictMapList();
    dictCompare()
  }, [params]);

  useEffect(() => {
    setCompareValue(priorityList[0]?.key)
  }, [priorityList]);

  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: (selectedRowKeys) => {
      saveModelsState({
        selectKeys: selectedRowKeys
      })
    },
    getCheckboxProps: (record) => ({
      disabled: record.taskState !== 'CREATED',
      name: record.name,
    }),
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
      title: '任务编号',
      dataIndex: 'taskCode',
      key: 'taskCode',
      width: 200,
      flag: true,
      fixed: 'left',
    },
    {
      title: '任务状态',
      dataIndex: 'taskState',
      key: 'taskState',
      flag: true,
      type: 'select',
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
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      flag: true,
      type: 'select',
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
      title: '起点',
      dataIndex: 'startPositionName',
      key: 'startPositionName',
      width: 200,
    },
    {
      title: '终点',
      dataIndex: 'endPositionName',
      key: 'endPositionName',
      width: 200,
    },
    {
      title: 'AGV类型',
      dataIndex: 'expectedAgvModelId',
      key: 'expectedAgvModelId',
      flag: true,
      type: 'select',
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
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      flag: true,
      type: 'number',
      min: 0,
      max: 10,
      addonBefore: <Select onChange={(value)=>{setCompareValue(value)}} defaultValue={priorityList[0]} className="select-before">
        {
          priorityList && priorityList.map(item=> {
            return <Option value={item.key}>{item.value}</Option>
          })
        }
    </Select>
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      width: 100,
      key: 'createUser'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      render: text =><span>{moment(text).format('YYYY-MM-DD')}</span>,
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
              disabled={rec.taskState !== 'CREATED'}
              icon={<FormOutlined />}
              size="small"
              className={rec.taskState !== 'CREATED' ? "disableButton" : 'editButton'}
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
              disabled={rec.taskState === 'FINISHED' || rec.taskState === 'CANCEL'}
            >
              <Button
                disabled={rec.taskState === 'FINISHED' || rec.taskState === 'CANCEL'}
                icon={<DeleteOutlined />}
                size="small"
                className={(rec.taskState === 'FINISHED' || rec.taskState === 'CANCEL') ? "" : 'delButton'}
              >
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
        if (key === 'priority' && value !== undefined && value !== null) {
          valueForm[key] = value;
          valueForm['compare'] = compareValue;
        }
      }
      saveModelsState({
        params: { ...params, ...valueForm },
      });
    });
  };

  return (
    <div className={styles.container}>
      <BreadcrumbStyle aheadTitle={[{ title: '任务中心' }]} currentTitle="任务管理" />
      <div className={styles.middleBox}>
        <div className={styles.middleBoxButton}>
          <div className={styles.listIcon}>
            <Iconfont iconMode="unicode" type="icon-gold" className="prefixIcon" />
            任务管理列表
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
            <Button
              type="primary"
              icon={<RetweetOutlined />}
              className="addButton"
              disabled={!selectKeys.length}
              onClick={() => {
                dictIssue({ ids: selectKeys });
              }}
            >
              下发
            </Button>
          </div>
        </div>
        <p className={styles.splitLine} />
        <div className={styles.tableBox}>
          <div className={styles.searchForm}>
            <SearchSel
              selForm={selForm}
              columns={columns}
              params={params}
              onFinishSel={onFinishSel}
            />
          </div>
          <div className={styles.tableStyles}>
            <Table
              columns={columns}
              dataSource={ruleData}
              scroll={{ y: windowInnerHeight - 380, x: 'max-content' }}
              pagination={{total, current: params.current}}
              onChange={(pagination)=> {
                saveModelsState({
                  params: { ...params, ...pagination },
                });
              }}
              rowSelection={{ ...rowSelection }}
              rowKey={(record) => record.id}
            />
          </div>
        </div>
      </div>
      <ModalFrom
        saveModelsState={saveModelsState}
        taskStates={taskStates}
        agvModelList={agvModelList}
        dictMapList={dictMapList}
        taskTypeList={taskTypeList}
      />
    </div>
  );
};

export default AutoScale(TaskManage);
