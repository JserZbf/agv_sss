import React, { useEffect } from 'react';
import { Table, Button, Popconfirm, Switch, Form } from 'antd';
import { Link} from 'umi';
import moment from 'moment';
import AutoScale from 'components/AutoScale';
import MultipleSel from 'components/MultipleSel';
import { useSelector, useDispatch } from 'dva';
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  FormOutlined,
  DeleteOutlined,
  PlusOutlined,
  DiffOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined
} from '@ant-design/icons';
import styles from './index.less';
import ModalFrom from './components/ModalFrom';

const MapList = function ({ windowInnerHeight }) {
  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'mapList/save', payload });
  const dictPage = (payload) => dispatch({ type: 'mapList/dictPage', payload });
  const dictDel = (payload) => dispatch({ type: 'mapList/dictDel', payload });
  const dictUpState = (payload) => dispatch({ type: 'mapList/dictUpState', payload });

  const { params, ruleData } = useSelector(
    (models) => models.mapList,
  );

  const [selForm] = Form.useForm();

  useEffect(() => {
    dictPage();
  }, [params]);

  const columns = [
    {
      title: '序号',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '地图名称',
      dataIndex: 'mapName',
      key: 'mapName',
      flag: true,
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
      render: (text, rec) =>{
        return <Switch
        checked={text}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        onChange={() => {
          dictUpState({
            id: rec.id,
            mapDescription: rec.mapDescription,
            mapName: rec.mapName,
            used: !text 
          })
        }}
      />
      },
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 200,
      render: (tex, rec) => {
        return (
          <div className="operate">  
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

  const onFinishSel = () => {
    selForm.validateFields().then((values) => {
      const valueForm = {};
      for (const [key, value] of Object.entries(values)) {
        if (value !== '') {
          valueForm[key] = value;
        }
      }
      saveModelsState({
        params: { ...params, ...valueForm },
      });
    });
  };

  return (
    <div className={styles.container}>
      <BreadcrumbStyle aheadTitle={[{ title: '地图管理' }]} currentTitle="地图列表" />
      <div className={styles.middleBox}>
        <div className={styles.middleBoxButton}>
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
              scroll={{ y: windowInnerHeight - 380 }}
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

export default AutoScale(MapList);
