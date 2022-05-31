import React, { useEffect } from 'react';
import { Button, Form, Row, Col } from 'antd';
import SearchSel from 'components/SearchSel';
import AutoScale from 'components/AutoScale';
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  PlusOutlined
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';
import MountFrom from './components/MountFrom';
import ParameFrom from './components/ParameFrom';
import CardItem from './components/CardItem';

const Home = function () {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'vehicleList/save', payload });
  const dictPage = (payload) => dispatch({ type: 'vehicleList/dictPage', payload });
  const dictState = (payload) => dispatch({ type: 'vehicleList/dictState', payload });
  const dictAgvModel = (payload) => dispatch({ type: 'vehicleList/dictAgvModel', payload });
  const dictMapList = (payload) => dispatch({ type: 'vehicleList/dictMapList', payload });

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
                return <Col span={7}>
                  <div className={styles.cardItemsStyles}>
                    <CardItem
                      item={item}
                      index={index}
                      saveModelsState={saveModelsState}
                      agvModelList={agvModelList}
                    />
                  </div>
                </Col>  
                })
            }
          </Row>
            
          </div>
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

export default AutoScale(Home);
