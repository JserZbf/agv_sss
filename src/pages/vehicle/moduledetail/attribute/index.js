import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Popconfirm, Radio, Modal } from 'antd';
import MultipleSel from 'components/MultipleSel';
import AutoScale from 'components/AutoScale';
import { Link} from 'umi'
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  VerticalAlignBottomOutlined,
  DiffOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';

const Home = function ({ windowInnerHeight }) {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'vehicleAttribute/save', payload });
  const dictPage = (payload) => dispatch({ type: 'vehicleAttribute/dictPage', payload });
  // const dictAdd = (payload) => dispatch({ type: 'vehicleModuleList/dictAdd', payload });
  // const dictUpdate = (payload) => dispatch({ type: 'vehicleModuleList/dictUpdate', payload });
  // const dictDel = (payload) => dispatch({ type: 'vehicleModuleList/dictDel', payload });

  const { isAdd, storeData, visible, params, ruleData } = useSelector(
    (models) => models.vehicleAttribute,
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

  const columns = [
    {
      title: '序号',
      render: (text, record, index) => <span>{index+1}</span>,
    },
    {
      title: '参数编码',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '参数名称',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '数据类型',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '描述',
      dataIndex: 'updateTime',
      key: 'updateTime',
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
              className="editButton"
              onClick={() => {
                saveModelsState({
                  // isAdd: false,
                  visible: true,
                  // storeData: {
                  //   ...rec,
                  // },
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
                // dictDel({ ids: [rec.id] });
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
      console.log(valueForm,'保存数据')
      saveModelsState({
        params: { ...valueForm },
      });
    });
  };

  return (
    <div className={styles.container}>
      <BreadcrumbStyle aheadTitle={[{ title: '模块管理' }, { title: '详情' }]} currentTitle="属性" />
      <div className={styles.middleBox}>
        <div className={styles.middleBoxButton}>
          <div className={styles.listIcon}>
            <Radio.Group defaultValue="attribute" buttonStyle="solid">   
              <Radio.Button className={styles.detailtabradio} value="attribute">属性</Radio.Button>
              <Link to="/vehicle/moduledetail/action">
                <Radio.Button value="action">动作</Radio.Button>
              </Link>
            </Radio.Group>
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
            <Button
              type="primary"
              icon={<DiffOutlined />}
              className="addButton"
              onClick={() => {
                saveModelsState({
                  visible: true,
                });
              }}
            >
              导入
            </Button>
            <Button
              type="primary"
              icon={<VerticalAlignBottomOutlined />}
              className="addButton"
              onClick={() => {
                saveModelsState({
                  visible: true,
                });
              }}
            >
              模板导出
            </Button>
          </div>
        </div>
        <p className={styles.splitLine} />
        <div className={styles.tableBox}>
          <div className={styles.tableStyles}>
            <Table
              columns={columns}
              dataSource={ruleData}
              scroll={{ y: windowInnerHeight - 380 }}
              rowSelection={{ ...rowSelection }}
              rowKey={(record) => record.id}
            />
            <Button
              type="primary"
              className={styles.paginationStyle}
              icon={<DeleteOutlined />}
              onClick={showConfirm}
              disabled={!selectKeys?.length}
            >
              批量删除
            </Button>
          </div>
        </div>
      </div>
      <ModalFrom
        saveModelsState={saveModelsState}
        visible={visible}
        isAdd={isAdd}
        storeData={storeData}
      />
    </div>
  );
};

export default AutoScale(Home);
