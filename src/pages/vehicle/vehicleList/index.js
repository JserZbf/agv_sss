import React, { useEffect } from 'react';
import { Card, Button, Form, List } from 'antd';
import { Link} from 'umi';
import moment from 'moment';
import MultipleSel from 'components/MultipleSel';
import AutoScale from 'components/AutoScale';
import Iconfont from 'components/Iconfont';
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  DeploymentUnitOutlined,
  LoginOutlined,
  EditOutlined,
  RedoOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';
import MountFrom from './components/MountFrom';
import ParameFrom from './components/ParameFrom';

const Home = function ({ windowInnerHeight }) {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'vehicleList/save', payload });
  const dictPage = (payload) => dispatch({ type: 'vehicleList/dictPage', payload });
  const dictState = (payload) => dispatch({ type: 'vehicleList/dictState', payload });
  const dictAdd = (payload) => dispatch({ type: 'vehicleList/dictAdd', payload });
  const dictDel = (payload) => dispatch({ type: 'vehicleList/dictDel', payload });

  const { isAdd, storeData, visible, params, mountVisible,parameVisible, ruleData, stateList } = useSelector(
    (models) => models.vehicleList,
  );

  const dataKey = [{
    key: 'agvName',
    value: '车辆编码'
  },{
    key: 'type',
    value: '车辆类型'
  },{
    key: 'agvState',
    value: '状态'
  },{
    key: 'lowBatteryStandard',
    value: '电量'
  },{
    key: 'maxSpeed',
    value: '速度'
  },{
    key: 'positionId',
    value: '所在点'
  }];

  const [selForm] = Form.useForm();
  useEffect(() => {
    console.log(dictState,'ioioio')
    dictPage();
  }, [params]);

  useEffect(() => {
    dictState()
  }, []);

  const searchData = [
    {
      title: '车辆名称',
      dataIndex: 'agvName',
      key: 'agvName',
      flag: true,
    },
    
    {
      title: '车辆类型',
      dataIndex: 'supplierName',
      key: 'supplierName',
      flag: true,
      showOption:{
        key: 'key',
        content: 'value'
      },
      data: stateList
    }
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
      <BreadcrumbStyle aheadTitle={[{ title: '车辆中心' }]} currentTitle="车辆管理" />
      <div className={styles.middleBox}>
        <div className={styles.middleBoxButton}>
          <div className={styles.listIcon}>
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
          </div>
        </div>
        <p className={styles.splitLine} />
        <div className={styles.tableBox}>
          <div className={styles.searchForm}>
            {/* ↓该组件自行实现，现有组件有bug */}
            <MultipleSel
              selForm={selForm}
              columns={searchData}
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
          <p className={styles.splitLine} />
          <div className={styles.cardStyles}>
            {
              ruleData.map((item, index)=> {
                return <div className={styles.cardItemsStyles}>
                   <Card
                    title={`站台${index + 1}`}
                    headStyle={{background: '#6290fa', borderRadius: '20px 20px 0 0', color: '#fff'}}
                    style={{borderRadius: '20px'}}
                      actions={[
                        <div onClick={()=>{
                            saveModelsState({
                              mountVisible: true,
                            });}
                        } className={styles.cardItemsMount}><DeploymentUnitOutlined />挂载</div>,
                        <div className={styles.cardItemsOut}><LoginOutlined />退出</div>,
                        <div className={styles.cardItemsReset}><RedoOutlined />复位</div>,
                        <div onClick={()=>{
                          saveModelsState({
                            parameVisible: true,
                          });}
                         } className={styles.cardItemsEdit}><EditOutlined />配置</div>,
                        <div className={styles.cardItemsDelete}><DeleteOutlined />删除</div>,
                      ]}
                    >
                      <List
                        bordered={false}
                        size={'small'}
                        dataSource={dataKey}
                        renderItem={list => (
                          <List.Item>
                            <div style={{display: 'flex',width: '100%', justifyContent: 'space-between'}}>
                              <span className={styles.listItemTitle}>{list['value']}:</span> {item[list['key']]}
                            </div>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </div>
                })
            }
          </div>
        </div>
      </div>
      <ModalFrom
        saveModelsState={saveModelsState}
        dictAdd={dictAdd}
        visible={visible}
        isAdd={isAdd}
        storeData={storeData}
      />
       <MountFrom
        saveModelsState={saveModelsState}
        dictAdd={dictAdd}
        visible={mountVisible}
      />
      <ParameFrom
        saveModelsState={saveModelsState}
        dictAdd={dictAdd}
        visible={parameVisible}
      />
    </div>
  );
};

export default AutoScale(Home);
