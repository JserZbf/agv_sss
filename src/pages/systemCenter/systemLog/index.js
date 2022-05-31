import React, { useEffect } from 'react';
import { Table, Button, Form } from 'antd';
import SearchSel from 'components/SearchSel';
import AutoScale from 'components/AutoScale';
import Iconfont from 'components/Iconfont';
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  PlusOutlined
} from '@ant-design/icons';
import styles from './index.less';

const Home = function () {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'systemLog/save', payload });
  const dictPage = (payload) => dispatch({ type: 'systemLog/dictPage', payload });
  const dictTaskStates = (payload) => dispatch({ type: 'systemLog/dictTaskStates', payload });

  const { params, ruleData, taskStates } = useSelector(
    (models) => models.systemLog,
  );

  const [ selForm ] = Form.useForm();
  useEffect(() => {
    dictTaskStates()
    dictPage();
  }, [params]);

  const columns = [
    {
      title: '序号',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 100,  
      dataIndex: 'index',
    },
    {
      title: '时间',
      dataIndex: 'taskCode',
      key: 'taskCode',
      width: 200,
      flag: true,
      type: 'datePicker',
    },
    {
      title: '类型',
      dataIndex: 'agvStateType',
      key: 'agvStateType',
      width: 200,
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
      title: '名称',
      dataIndex: 'agvName',
      key: 'agvName',
      width: 200,
    },
    {
      title: '详细描述',
      dataIndex: 'agvStateRecordDescription',
      key: 'agvStateRecordDescription',
      width: 200,
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
      <BreadcrumbStyle aheadTitle={[{ title: '系统改中心' }]} currentTitle="系统日志" />
      <div className={styles.middleBox}>
        <div className={styles.middleBoxButton}>
          <div className={styles.listIcon}>
            <Iconfont iconMode="unicode" type="icon-gold" className="prefixIcon" />
            系统日志管理列表
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
              导出
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
              scroll={{scrollToFirstRowOnChange: true,x: 1000}}
              rowKey={(record) => record.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoScale(Home);
