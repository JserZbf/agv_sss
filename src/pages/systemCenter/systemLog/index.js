import React, { useEffect } from 'react';
import { Table, Button, Form } from 'antd';
import SearchSel from 'components/SearchSel';
import AutoScale from 'components/AutoScale';
import Iconfont from 'components/Iconfont';
import moment from 'moment';
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  PlusOutlined
} from '@ant-design/icons';
import styles from './index.less';

const SystemLog = function ({windowInnerHeight}) {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'systemLog/save', payload });
  const dictPage = (payload) => dispatch({ type: 'systemLog/dictPage', payload });
  const dictTaskStates = (payload) => dispatch({ type: 'systemLog/dictTaskStates', payload });
  const dictExport = (payload) => dispatch({ type: 'systemLog/dictExport', payload });

  const { params, total, ruleData, taskStates } = useSelector(
    (models) => models.systemLog,
  );

  const [ selForm ] = Form.useForm();
  useEffect(() => {
    dictTaskStates()
    dictPage();
  }, [params]);

  const searchForm = [
    {
      title: '时间区间',
      dataIndex: 'time',
      key: 'time',
      flag: true,
      type: 'rangePicker',
    },
    {
      title: '类型',
      dataIndex: 'agvStateType',
      key: 'agvStateType',
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
  ]

  const columns = [
    {
      title: '序号',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 80,  
      dataIndex: 'index',
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'agvStateType',
      key: 'agvStateType',
      width: 100,
      render: (text) =>{
        const showState = taskStates.find(item=> text === item.key)
        return showState?.value
      }
    },
    {
      title: '名称',
      dataIndex: 'agvName',
      key: 'agvName',
      width: 150,
    },
    {
      title: '详细描述',
      dataIndex: 'agvStateRecordDescription',
      key: 'agvStateRecordDescription'
    }
  ];

  const onFinishSel = () => {
    selForm.validateFields().then((values) => {
      const valueForm = {};
      for (const [key, value] of Object.entries(values)) {
        if (key === 'time' && value) {
          value.forEach((item, index)=> {
            switch(index) {
              case 0:
                valueForm['startTime'] = moment(item).format('YYYY-MM-DD HH:mm:ss');
                break;
              case 1:
                valueForm['endTime'] = moment(item).format('YYYY-MM-DD HH:mm:ss');
                break;
            }
          })
        } else {
          valueForm[key] = value
        }
      }
      saveModelsState({
        params: { ...params, ...valueForm },
      });
    });
  };

  const exportLog = () => {
    selForm.validateFields().then((values) => {
      const valueForm = {};
      for (const [key, value] of Object.entries(values)) {
        if (value !== '') {
          if (key === 'time' && value) {
            value.forEach((item, index)=> {
              switch(index) {
                case 0:
                  valueForm['startTime'] = moment(item).format('YYYY-MM-DD HH:mm:ss');
                  break;
                case 1:
                  valueForm['endTime'] = moment(item).format('YYYY-MM-DD HH:mm:ss');
                  break;
              }
            })
          } else {
            valueForm[key] = value
          }
        }
      }
      dictExport({...valueForm, current: 1})
    });
  }

  return (
    <div className={styles.container}>
      <BreadcrumbStyle aheadTitle={[{ title: '系统中心' }]} currentTitle="系统日志" />
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
                exportLog()   
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
              columns={searchForm}
              onFinishSel={onFinishSel}
            />
          </div>
          <div className={styles.tableStyles}>
            <Table
              columns={columns}
              dataSource={ruleData}
              scroll={{ y: windowInnerHeight - 380, x: 'max-content' }}
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
    </div>
  );
};

export default AutoScale(SystemLog);
