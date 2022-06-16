import React, { useEffect } from 'react';
import { Button, Form, Row, Col, Empty } from 'antd';
import SearchSel from 'components/SearchSel';
import AutoScale from 'components/AutoScale';
import { useSelector, useDispatch } from 'dva';
import Iconfont from 'components/Iconfont';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  PlusOutlined
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';
import MountFrom from './components/MountFrom';
import ParameFrom from './components/ParameFrom';
import CardItem from './components/CardItem';

const VehicleList = function () {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'vehicleList/save', payload });
  const dictPage = (payload) => dispatch({ type: 'vehicleList/dictPage', payload });
  const dictState = (payload) => dispatch({ type: 'vehicleList/dictState', payload });
  const dictAgvModel = (payload) => dispatch({ type: 'vehicleList/dictAgvModel', payload });
  const dictMapList = (payload) => dispatch({ type: 'vehicleList/dictMapList', payload });
  const dictStopTime = (payload) => dispatch({ type: 'vehicleList/dictStopTime', payload });

  const {  params, ruleData, agvModelList, agvPositonList, agvInfo } = useSelector(
    (models) => models.vehicleList,
  );

  const [selForm] = Form.useForm();
  useEffect(() => {
    dictPage();
  }, [params]);

  useEffect(() => {
    dictState()
    dictAgvModel()
    dictMapList()
    return componentWillUnmount;
  }, []);

  const  componentWillUnmount = ()=> {
    dictStopTime()
  }

  const searchData = [
    {
      title: '车辆名称',
      dataIndex: 'agvName',
      key: 'agvName',
      flag: true,
    },
    
    {
      title: '车辆类型',
      dataIndex: 'agvModelId',
      key: 'agvModelId',
      flag: true,
      type: 'select',
      showOption:{
        key: 'key',
        content: 'value'
      },
      data: agvModelList
    }
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
      <BreadcrumbStyle aheadTitle={[{ title: '车辆中心' }]} currentTitle="车辆管理" />
      <div className={styles.middleBox}>
        <div className={styles.middleBoxButton}>
          <div className={styles.listIcon}>
            <Iconfont iconMode="unicode" type="icon-gold" className="prefixIcon" />
            车辆管理列表
          </div>
          <div className={styles.buttonFlex}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="addButton"
              onClick={() => {
                saveModelsState({
                  visible: true,
                  isAdd: true
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
                  ruleData.map((item)=> {
                    return <Col key={item.key}>
                      <div className={styles.cardItemsStyles}>
                        <CardItem
                          item={item}
                          saveModelsState={saveModelsState}
                          agvModelList={agvModelList}
                        />
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
      <ModalFrom
        saveModelsState={saveModelsState}
        agvModelList={agvModelList}
        agvPositonList={agvPositonList}
      />
       <MountFrom
        saveModelsState={saveModelsState}
        agvPositonList={agvPositonList}
        agvInfo={agvInfo}
      />
      <ParameFrom
        saveModelsState={saveModelsState}
        agvInfo={agvInfo}
      />
    </div>
  );
};

export default AutoScale(VehicleList);
