import React, { useEffect } from 'react';
import { Table, Button, Radio } from 'antd';
import AutoScale from 'components/AutoScale';
import { Link, history } from 'umi'
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  FormOutlined
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';

const VehicleAttribute = function ({ windowInnerHeight }) {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'vehicleAttribute/save', payload });
  const dictPage = (payload) => dispatch({ type: 'vehicleAttribute/dictPage', payload });
  const dictUpdate = (payload) => dispatch({ type: 'vehicleAttribute/dictUpdate', payload });

  const { storeData, visible, params, ruleData } = useSelector(
    (models) => models.vehicleAttribute,
  );
  useEffect(() => {
    const agvId = history?.location?.query?.agvId
    saveModelsState({agvId})
    dictPage({agvId});
  }, [params]);

  const columns = [
    {
      title: '序号',
      render: (text, record, index) => <span>{index+1}</span>,
    },
    {
      title: '模型名称',
      dataIndex: 'agvModelName',
      key: 'agvModelName',
    },
    {
      title: '控制精度',
      dataIndex: 'agvPrecision',
      key: 'agvPrecision',
    },
    {
      title: 'AGV低电量标准',
      dataIndex: 'lowBatteryStandard',
      key: 'lowBatteryStandard',
    },
    {
      title: 'AGV供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: '操作',
      dataIndex: 'address',
      align: 'center',
      width: 100,
      render: (tex, rec) => {
        return (
          <div className="operate">
            <Button
              icon={<FormOutlined />}
              size="small"
              className="editButton"
              onClick={() => {
                saveModelsState({
                  storeData: rec,
                  visible: true,
                });
              }}
            >
              修改
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <BreadcrumbStyle aheadTitle={[{ title: '模块管理' }, { title: '详情' }]} currentTitle="属性" />
      <div className={styles.middleBox}>
        <div className={styles.middleBoxButton}>
          <div className={styles.listIcon}>
            <Radio.Group defaultValue="attribute" buttonStyle="solid">   
              <Radio.Button className={styles.detailtabradio} value="attribute">属性</Radio.Button>
              <Link to={{
                pathname: '/vehicle/moduledetail/action',
                search: `?agvId=${history?.location?.query?.agvId}`
              }}>
                <Radio.Button value="action">动作</Radio.Button>
              </Link>
            </Radio.Group>
          </div>
        </div>
        <p className={styles.splitLine} />
        <div className={styles.tableBox}>
          <div className={styles.tableStyles}>
            <Table
              columns={columns}
              dataSource={ruleData}
              scroll={{ y: windowInnerHeight - 380 }}
              rowKey={(record) => record.id}
            />
          </div>
        </div>
      </div>
      <ModalFrom
        saveModelsState={saveModelsState}
        visible={visible}
        storeData={storeData}
        dictUpdate={dictUpdate}
      />
    </div>
  );
};

export default AutoScale(VehicleAttribute);
