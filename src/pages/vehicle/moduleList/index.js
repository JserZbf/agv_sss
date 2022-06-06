import React, { useEffect } from 'react';
import { Table, Button, Form, Popconfirm } from 'antd';
import { Link} from 'umi';
import moment from 'moment';
import SearchSel from 'components/SearchSel';
import AutoScale from 'components/AutoScale';
import Iconfont from 'components/Iconfont';
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  DiffOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';

const VehicleModuleList = function ({ windowInnerHeight }) {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'vehicleModuleList/save', payload });
  const dictPage = (payload) => dispatch({ type: 'vehicleModuleList/dictPage', payload });
  const dictDel = (payload) => dispatch({ type: 'vehicleModuleList/dictDel', payload });

  const { params, total, ruleData } = useSelector(
    (models) => models.vehicleModuleList,
  );

  const [selForm] = Form.useForm();
  useEffect(() => {
    dictPage();
  }, [params]);

  const searchData = [
    {
      title: '车辆模板',
      dataIndex: 'agvModelName',
      key: 'agvModelName',
      flag: true,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      flag: true,
    }
  ];

  const columns = [
    {
      title: '信息',
      render: (text, record) =><div>
        <div>
          <div>{record.agvModelName}</div>
          <div>{record.supplierName}</div>
        </div>
      </div>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text =><span>{moment(text).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: text =><span>{moment(text).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '操作',
      dataIndex: 'address',
      align: 'center',
      width: 250,
      render: (tex, rec) => {
        return (
          <div className="operate">
            <Link to={{
              pathname: '/vehicle/moduledetail/attribute',
              search: `?agvId=${rec.id}`
            }}>
              <Button
                icon={<DiffOutlined />}
                size="small"
                className="editButton"
              >
                详情
              </Button>   
            </Link>
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
      <BreadcrumbStyle aheadTitle={[{ title: '车辆中心' }]} currentTitle="模块管理" />
      <div className={styles.middleBox}>
        <div className={styles.middleBoxButton}>
          <div className={styles.listIcon}>
            <Iconfont iconMode="unicode" type="icon-gold" className="prefixIcon" />
            车体管理列表
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
            <SearchSel
              selForm={selForm}
              columns={searchData}
              onFinishSel={onFinishSel}
            />
          </div>
          <div className={styles.tableStyles}>
            <Table
              columns={columns}
              dataSource={ruleData}
              scroll={{ y: windowInnerHeight - 380 }}
              pagination={{total}}
              onChange={(pagination)=> {
                saveModelsState({
                  params: { ...pagination },
                });
              }}
              rowKey={(record) => record.id}
            />
          </div>
        </div>
      </div>
      <ModalFrom
        saveModelsState={saveModelsState}
      />
    </div>
  );
};

export default AutoScale(VehicleModuleList);
