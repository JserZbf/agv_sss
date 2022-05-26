import React, { useEffect } from 'react';
import { Table, Button, Form, Popconfirm } from 'antd';
import { Link} from 'umi';
import moment from 'moment';
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
  RetweetOutlined
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';

const Home = function ({ windowInnerHeight }) {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'taskManage/save', payload });
  const dictPage = (payload) => dispatch({ type: 'taskManage/dictPage', payload });
  const dictAdd = (payload) => dispatch({ type: 'taskManage/dictAdd', payload });
  const dictDel = (payload) => dispatch({ type: 'taskManage/dictDel', payload });
  const dictTaskStates = (payload) => dispatch({ type: 'taskManage/dictTaskStates', payload });
  const dictAgvModel = (payload) => dispatch({ type: 'taskManage/dictAgvModel', payload });
  const dictAgvPosition = (payload) => dispatch({ type: 'taskManage/dictAgvPosition', payload });

  const { isAdd, storeData, visible, params, ruleData, taskStates, agvModelList, agvPositonList } = useSelector(
    (models) => models.taskManage,
  );

  // const [selectKeys, setSelectKeys] = useState([]);

  const [selForm] = Form.useForm();
  useEffect(() => {
    dictTaskStates()
    dictAgvModel()
    dictPage();
  }, [params]);

  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setSelectKeys(selectedRowKeys);
  //   },
  // };

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
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      flag: true
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      flag: true,
      width: 100,
      showOption:{
        key: 'key',
        content: 'value'
      },
      data: [{
        key: 'MOVE',
        value: '移动'
      }, {
        key: 'ACTION',
        value: '动作'
      }]
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
      width: 150,
      flag: true,
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
      title: '任务状态',
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
      title: '创建人',
      dataIndex: 'creatorId',
      width: 100,
      key: 'creatorId'
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
                });
              }}
            >
              新增
            </Button>
            <Button
              type="primary"
              icon={<RetweetOutlined />}
              className="addButton"
              onClick={() => {
                saveModelsState({
                  visible: true,
                });
              }}
            >
              下发
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
              advancedSearch={true}
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
              // rowSelection={{ ...rowSelection }}
              rowKey={(record) => record.id}
            />
          </div>
        </div>
      </div>
      <ModalFrom
        saveModelsState={saveModelsState}
        dictAgvPosition={dictAgvPosition}
        dictAdd={dictAdd}
        taskStates={taskStates}
        visible={visible}
        isAdd={isAdd}
        storeData={storeData}
        agvModelList={agvModelList}
        agvPositonList={agvPositonList}
      />
    </div>
  );
};

export default AutoScale(Home);
