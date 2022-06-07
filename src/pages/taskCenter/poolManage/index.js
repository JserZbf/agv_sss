import React, { useEffect } from 'react';
import { Card, Form, List, Popconfirm, Row, Col, Steps } from 'antd';
import SearchSel from 'components/SearchSel';
import AutoScale from 'components/AutoScale';
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  LoginOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import styles from './index.less';

const { Step } = Steps;

const PoolManage = function ({}) {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'poolManage/save', payload });
  const dictPage = (payload) => dispatch({ type: 'poolManage/dictPage', payload });
  const dictDel = (payload) => dispatch({ type: 'poolManage/dictDel', payload });
  const dicPause = (payload) => dispatch({ type: 'poolManage/dicPause', payload });
  const dictTaskStates = (payload) => dispatch({ type: 'poolManage/dictTaskStates', payload });
  const dictAgvModel = (payload) => dispatch({ type: 'poolManage/dictAgvModel', payload });
  const dictMapList = (payload) => dispatch({ type: 'poolManage/dictMapList', payload });
  const dictTaskType = (payload) => dispatch({ type: 'poolManage/dictTaskType', payload });
  const dictStopTime = (payload) => dispatch({ type: 'poolManage/dictStopTime', payload });

  const { ruleData, taskStates, agvModelList,taskTypeList } = useSelector(
    (models) => models.poolManage,
  );

  const dataKey = [{
    key: 'priority',
    value: '优先级'
  },{
    key: 'agvState',
    value: 'agv状态',
    render:(text)=> {
      return <Steps className='stepsContent' progressDot current={1} size={'small'}>
      <Step title="Finished" description="." />
      <Step title="In Progress" description="." />
      <Step title="Waiting" description="." />
    </Steps>
    }
  },{
    key: 'taskType',
    value: '任务类型',
    render:(text)=> {
      const showState = agvModelList.find(item=> text === item.key)
      return showState?.value
    }
  },{
    key: 'startPositionName',
    value: '起点'
  },{
    key: 'endPositionName',
    value: '终点'
  },{
    key: 'agvName',
    value: '当前节点'
  },{
    key: 'expectedAgvModelName',
    value: 'agv类型'
  },{
    key: 'expectedAgvModelName',
    value: '执行agv',
  }];

  const [selForm] = Form.useForm();

  useEffect(() => {
    dictTaskType()
    dictAgvModel()
    dictTaskStates()
    dictMapList()
    dictPage()
    return componentWillUnmount;
  }, []);

  const  componentWillUnmount = ()=> {
    dictStopTime()
  }

  const searchData = [
    {
      title: '任务编号',
      dataIndex: 'taskCode',
      key: 'taskCode',
      flag: true,
    },
    
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      flag: true,
      type: 'number'
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      flag: true,
      type: 'select',
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
      title: 'AGV类型',
      dataIndex: 'expectedAgvModelId',
      key: 'expectedAgvModelId',
      flag: true,
      type: 'select',
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
      type: 'select',
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
      <BreadcrumbStyle aheadTitle={[{ title: '任务管理' }]} currentTitle="任务池" />
      <div className={styles.middleBox}>
        <div className={styles.tableBox}>
          <div className={styles.searchForm}>
            {/* ↓该组件自行实现，现有组件有bug */}
            <SearchSel
              selForm={selForm}
              columns={searchData}
              onFinishSel={onFinishSel}
            />
          </div>
          <p className={styles.splitLine} />
          <div className={styles.cardStyles}>
          <Row justify="start" gutter={16}>
            {
              ruleData.map((item, index)=> {
                return <Col>
                  <div className={styles.cardItemsStyles}>
                   <Card
                    title={item.taskCode}
                    headStyle={{background: '#6290fa', borderRadius: '20px 20px 0 0', color: '#fff'}}
                    style={{borderRadius: '20px'}}
                      actions={[
                        <Popconfirm
                          title="是否暂停？"
                          okText="确定"
                          cancelText="取消"
                          onConfirm={() => {
                            dicPause({ id: item.id })
                          }}
                        >
                          <div className={styles.cardItemsOut}><LoginOutlined />暂停</div>
                        </Popconfirm>,
                         <Popconfirm
                          title="是否删除？"
                          okText="确定"
                          cancelText="取消"
                          onConfirm={() => {
                            dictDel({ id: item.id });
                          }}
                        >
                           <div className={styles.cardItemsDelete}><DeleteOutlined />删除</div>
                        </Popconfirm>,
                      ]}
                    >
                      <List
                        size={'small'}
                        dataSource={dataKey}
                        renderItem={list => (
                          <List.Item className={(list['key']==='priority' || list['key']==='agvState') ? styles.listItemAllcontent:styles.listItemcontent}>
                            <div>
                              <span className={styles.listItemTitle}>{list['value']}:</span> {
                                list.render ? list.render(item[list['key']]) : item[list['key']]
                              }
                            </div>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </div>
                </Col>  
                })
            }
          </Row>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoScale(PoolManage);
