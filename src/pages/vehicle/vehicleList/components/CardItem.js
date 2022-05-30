import React from 'react';
import { List, Card, Popconfirm } from 'antd';
import { useSelector, useDispatch } from 'dva';
import {
    DeploymentUnitOutlined,
    LoginOutlined,
    EditOutlined,
    RedoOutlined,
    DeleteOutlined
  } from '@ant-design/icons';
import styles from '../index.less';

const EditModal = ({ saveModelsState, item, index, agvModelList }) => {
  const dispatch = useDispatch();
  const resetAgv = (payload) => dispatch({ type: 'vehicleList/resetAgv', payload });
  const dictDel = (payload) => dispatch({ type: 'vehicleList/dictDel', payload });
  const dicUnmount = (payload) => dispatch({ type: 'vehicleList/dicUnmount', payload });

  const {  stateList } = useSelector(
    (models) => models.vehicleList,
  );

  const dataKey = [{
    key: 'agvName',
    value: '车辆编码'
  },{
    key: 'agvModelId',
    value: '车辆类型',
    render:(text)=> {
      const showState = agvModelList.find(item=> text === item.key)
      return showState?.value
    }
  },{
    key: 'agvState',
    value: '状态',
    render:(text)=> {
      const showState = stateList.find(item=> text === item.key)
      return showState?.value
    }
  },{
    key: 'lowBatteryStandard',
    value: '电量'
  },{
    key: 'maxSpeed',
    value: '速度'
  },{
    key: 'positionName',
    value: '所在点'
  }];

  return (
    <Card
        title={`站台${index + 1}`}
        headStyle={{background: '#6290fa', borderRadius: '20px 20px 0 0', color: '#fff'}}
        style={{borderRadius: '20px'}}
        actions={[
            <div onClick={()=>{
                saveModelsState({
                    mountVisible: true,
                    agvInfo: item
                });}
            } className={styles.cardItemsMount}><DeploymentUnitOutlined />挂载</div>,
            <Popconfirm
                title="是否退出？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  dicUnmount({agvId: item.id})
                }}
            >
                <div className={styles.cardItemsOut}><LoginOutlined />退出</div>
            </Popconfirm>,
            <Popconfirm
              title="是否复位？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                resetAgv({agvId: item.id})
              }}
            >
              <div className={styles.cardItemsReset}><RedoOutlined />复位</div>
            </Popconfirm>,
            <div onClick={()=>{
                saveModelsState({
                    parameVisible: true,
                    agvInfo: item
                });}
            } className={styles.cardItemsEdit}><EditOutlined />配置</div>,
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
        bordered={false}
        size={'small'}
        dataSource={dataKey}
        renderItem={list => (
          <List.Item>
            <div style={{display: 'flex',width: '100%', justifyContent: 'space-between'}}>
              <span className={styles.listItemTitle}>{list['value']}:</span> {
                list.render ? list.render(item[list['key']]) : item[list['key']]
              }
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default EditModal;
