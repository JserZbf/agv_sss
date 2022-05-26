import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Popconfirm, Modal } from 'antd';
import { Link} from 'umi';
import moment from 'moment';
import MultipleSel from 'components/MultipleSel';
import AutoScale from 'components/AutoScale';
import Iconfont from 'components/Iconfont';
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  DiffOutlined,
  HeatMapOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';

const MapList = function ({ windowInnerHeight }) {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'mapList/save', payload });
  const dictPage = (payload) => dispatch({ type: 'mapList/dictPage', payload });
  const dictAdd = (payload) => dispatch({ type: 'mapList/dictAdd', payload });
  const dictUpdate = (payload) => dispatch({ type: 'mapList/dictUpdate', payload });
  const dictDel = (payload) => dispatch({ type: 'mapList/dictDel', payload });
  const dictUpState = (payload) => dispatch({ type: 'mapList/dictUpState', payload });

  const { isAdd, storeData, visible, params, ruleData } = useSelector(
    (models) => models.mapList,
  );

  const [selectKeys, setSelectKeys] = useState([]);
  const { confirm } = Modal;
  const [selForm] = Form.useForm();
  useEffect(() => {
    dictPage();
  }, [params]);

  // const toTree = (arr, parentId) => {
  //   function loop(parentIds) {
  //     const res = [];
  //     for (let i = 0; i < arr.length; i += 1) {
  //       const item = arr[i];
  //       if (item.parentId === parentIds) {
  //         item.children = loop(item.id);
  //         res.push(item);
  //       }
  //     }
  //     return res.length === 0 ? undefined : res;
  //   }
  //   return loop(parentId);
  // };
  // const tree = toTree(ruleData, '0')?.filter((item) => {
  //   return item.layer === 0;
  // });
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectKeys(selectedRowKeys);
    },
  };

  const showConfirm = () => {
    confirm({
      title: '是否删除？',
      icon: <ExclamationCircleOutlined />,
      onOk() {},
    });
  };

  // const searchData = [
  //   {
  //     title: '车辆模板',
  //     dataIndex: 'agvModelName',
  //     key: 'agvModelName',
  //     flag: true,
  //   },
  //   {
  //     title: '供应商',
  //     dataIndex: 'supplierName',
  //     key: 'supplierName',
  //     flag: true,
  //   }
  // ];

  const columns = [
    {
      title: '序号',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '地图名称',
      dataIndex: 'mapName',
      key: 'mapName',
    },
    {
      title: '描述',
      dataIndex: 'mapDescription',
      key: 'mapDescription',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text =><span>{moment(text).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '是否启用',
      dataIndex: 'used',
      key: 'used',
      render: text =><span>{!!text ? '是': '否'}</span>,
    },
    {
      title: '操作',
      dataIndex: 'address',
      align: 'center',
      width: 250,
      render: (tex, rec) => {
        return (
          <div className="operate"> 
            <Button
              icon={<FormOutlined />}
              size="small"
              className="issuedButton"
              onClick={() => {
                dictUpState({
                  id: rec.id,
                  mapDescription: rec.mapDescription,
                  mapName: rec.mapName,
                  used: !rec.used 
                })
              }}
            >
              {rec.used ? '停用' : '启用'}
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
            <Link to={{
                pathname: `/mapManage/mapDetail/${rec.id}`,
                state: { mapId: rec.id },
              }}
            >
              <Button
                icon={<DiffOutlined />}
                size="small"
                className="detailsButton"
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

  return (
    <div className={styles.container}>
      <BreadcrumbStyle aheadTitle={[{ title: '地图管理' }]} currentTitle="地图列表" />
      <div className={styles.middleBox}>
        <div className={styles.middleBoxButton}>
          <div className={styles.listIcon}>
            {/* <Iconfont iconMode="unicode" type="icon-gold" className="prefixIcon" />
            车体管理列表 */}
          </div>
          <div className={styles.buttonFlex}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="addButton"
              onClick={() => {
                saveModelsState({
                  isAdd: true,
                  visible: true,
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
          </div>
          <div className={styles.tableStyles}>
            <Table
              columns={columns}
              dataSource={ruleData}
              scroll={{ y: windowInnerHeight - 380 }}
              rowSelection={{ ...rowSelection }}
              rowKey={(record) => record.id}
            />
          </div>
        </div>
      </div>
      <ModalFrom
        saveModelsState={saveModelsState}
        visible={visible}
        isAdd={isAdd}
        storeData={storeData}
        dictAdd={dictAdd}
        dictUpdate={dictUpdate}
      />
    </div>
  );
};

export default AutoScale(MapList);
