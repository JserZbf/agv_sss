import React, { useEffect } from 'react';
import { Table, Button, Form, Popconfirm } from 'antd';
import SearchSel from 'components/SearchSel';
import AutoScale from 'components/AutoScale';
import Iconfont from 'components/Iconfont';
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  FormOutlined,
  DeleteOutlined,
  PlusOutlined,
  HighlightOutlined
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';
import InteractFrom from './components/InteractFrom';

const PositionlManage = function () {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'positionlManage/save', payload });
  const dictPage = (payload) => dispatch({ type: 'positionlManage/dictPage', payload });
  const dictDel = (payload) => dispatch({ type: 'positionlManage/dictDel', payload });
  const dictInteractStates = (payload) => dispatch({ type: 'positionlManage/dictInteractStates', payload });
  const dictInteractType = (payload) => dispatch({ type: 'positionlManage/dictInteractType', payload });

  const { total, params, ruleData, interactList, interactTypeList } = useSelector(
    (models) => models.positionlManage,
  );

  const [selForm] = Form.useForm();
  useEffect(() => {
    dictInteractStates()
    dictInteractType()
    dictPage();
  }, [params]);


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
      dataIndex: 'machineId',
      key: 'machineId',
      width: 200,
      flag: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '点位',
      dataIndex: 'interactKey',
      key: 'interactKey'
    },
    {
      title: '数据类型',
      dataIndex: 'interactType',
      key: 'interactType',
      render: (text) =>{
        const showState = interactTypeList.find(item=> text === item.key)
        return showState?.value
      },
    },
    {
      title: '期望值',
      dataIndex: 'expectedValue',
      key: 'expectedValue'
    },
    {
      title: '当前值',
      dataIndex: 'interactValue',
      key: 'interactValue',
      width: 150
    },
    {
      title: '数据流向',
      dataIndex: 'interactTypeEnum',
      key: 'interactTypeEnum',
      flag: true,
      width: 100,
      type: 'select',
      render: (text) =>{
        const showState = interactList.find(item=> text === item.key)
        return showState?.value
      },
      showOption:{
        key: 'key',
        content: 'value'
      },
      data: interactList
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
              icon={<HighlightOutlined />}
              size="small"
              className="detailsButton"
              onClick={() => {
                saveModelsState({
                  interactVisible: true,
                  storeData: {
                    ...rec,
                  },
                });
              }}
            >
              下发
            </Button> 
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
          valueForm[key] = value;
      }
      saveModelsState({
        params: { ...params, ...valueForm },
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
            <SearchSel
              selForm={selForm}
              columns={columns}
              onFinishSel={onFinishSel}
            />
          </div>
          <div className={styles.tableStyles}>
            <Table
              columns={columns}
              dataSource={ruleData}
              pagination={{total}}
              onChange={(pagination)=> {
                saveModelsState({
                  params: { ...params, ...pagination },
                });
              }}
              rowKey={(record) => record.id}
            />
          </div>
        </div>
      </div>
      <ModalFrom
        saveModelsState={saveModelsState}
        interactTypeList={interactTypeList}
        interactList={interactList}
      />
      <InteractFrom
        saveModelsState={saveModelsState}
        interactTypeList={interactTypeList}
        interactList={interactList}
      />
    </div>
  );
};

export default AutoScale(PositionlManage);
