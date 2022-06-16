import React, { useEffect, useState } from 'react';
import { Card, Form, List, Popconfirm, Row, Col, Steps, Select, Empty } from 'antd';
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
  const dictTaskType = (payload) => dispatch({ type: 'poolManage/dictTaskType', payload });
  const dictStopTime = (payload) => dispatch({ type: 'poolManage/dictStopTime', payload });
  const dictCompare = (payload) => dispatch({ type: 'poolManage/dictCompare', payload });

  const { ruleData, taskStates, agvModelList, taskTypeList, priorityList } = useSelector(
    (models) => models.poolManage,
  );

  const [compareValue, setCompareValue] = useState(priorityList[0]?.key);

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
      const showState = taskTypeList.find(item=> text === item.key)
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
    dictCompare()
    dictTaskType()
    dictAgvModel()
    dictTaskStates()
    dictPage()
    return componentWillUnmount;
  }, []);

  useEffect(() => {
    setCompareValue(priorityList[0]?.key)
  }, [priorityList]);

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
    },{
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
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
        if (key === 'priority' && value) {
          valueForm[key] = value;
          valueForm['compare'] = compareValue;
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
          {
            ruleData.length > 0 ?
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
                              disabled={item.taskState === 'FINISHED' || item.taskState === 'CANCEL'}
                              onConfirm={() => {
                                dicPause({ id: item.id })
                              }}
                            >
                              <div className={(item.taskState === 'FINISHED' || item.taskState === 'CANCEL') ? styles.cardDisabled : styles.cardItemsOut}><LoginOutlined />暂停</div>
                            </Popconfirm>,
                            <Popconfirm
                              title="是否删除？"
                              okText="确定"
                              cancelText="取消"
                              disabled={item.taskState === 'FINISHED' || item.taskState === 'CANCEL'}
                              onConfirm={() => {
                                dictDel({ id: item.id });
                              }}
                            >
                              <div className={(item.taskState === 'FINISHED' || item.taskState === 'CANCEL') ? styles.cardDisabled : styles.cardItemsDelete}><DeleteOutlined />删除</div>
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
            : 
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </div>
      </div>
    </div>
  );
};

export default AutoScale(PoolManage);
