import React, { useEffect } from 'react';
import { Table, Button, Form } from 'antd';
import MultipleSel from 'components/MultipleSel';
import AutoScale from 'components/AutoScale';
import Iconfont from 'components/Iconfont';
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  PlusOutlined,
  SearchOutlined,
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
      fixed: 'left',
    },
    {
      title: '时间',
      dataIndex: 'taskCode',
      key: 'taskCode',
      width: 200,
      flag: true,
      fixed: 'left',
    },
    {
      title: '类型',
      dataIndex: 'startPositionName',
      key: 'startPositionName',
      width: 200,
      flag: true,
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
      title: '详细描述',
      dataIndex: 'endPositionName',
      key: 'endPositionName',
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
            {/* ↓该组件自行实现，现有组件有bug */}
            <MultipleSel
              selForm={selForm}
              columns={columns}
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
              rowKey={(record) => record.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoScale(Home);
