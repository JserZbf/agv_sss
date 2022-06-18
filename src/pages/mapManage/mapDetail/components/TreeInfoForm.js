import React, { useEffect, useState, useRef, useContext } from 'react';
import { Form, Drawer, Input, Select, Button, InputNumber, Table, Popconfirm, Switch } from 'antd';
import { arrayMoveImmutable } from 'array-move';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useSelector, useDispatch } from 'dva';
import { MenuOutlined, PlusOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const EditableContext = React.createContext(null);

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {

  const { operationList } = useSelector(
    (models) => models.mapDetail,
  ); 

  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `请选择${title}`,
          },
        ]}
      >
        <Select allowClear ref={inputRef} onPressEnter={save} onBlur={save} placeholder="请选择动作">
          {
            operationList && operationList.map(item=> {
              return <Select.Option value={item.key}>{item.value}</Select.Option>
            })
          }
        </Select>
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          width: '100%',
          minHeight: '20px'
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};



const EditModal = ({
  mapId,
  dictAdd,
  dictUpdate,
  saveModelsState,
  nodeData,  
}) => {

  const [form] = Form.useForm();


  const dispatch = useDispatch();
  const dictRelationUpdata = (payload) => dispatch({ type: 'mapDetail/dictRelationUpdata', payload });

  const { isAdd, treeSelectInfo, treeInfoFormVisible, agvModelList } = useSelector(
    (models) => models.mapDetail,
  ); 

  
  const [startPositionName, setStartPositionName] = useState('')
  const [endPositionName, setEndPositionName] = useState('')
  const [roadType, setRoadType] = useState('')
  const [dataSource, setDataSource] = useState([]);

  // 初始化可编辑table
  const SortableItem = SortableElement((props) => {
    const [form] = Form.useForm()
    return <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    });
  const SortableBody = SortableContainer((props) => <tbody {...props} />);


  // 生成拖拽table  -- start
  const DraggableContainer = (props) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = dataSource.findIndex((x) => x.key === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };
  
  const DragHandle = SortableHandle(() => (
    <MenuOutlined
      style={{
        cursor: 'grab',
        color: '#999',
      }}
    />
  ));

  // 生成拖拽table  -- end

  //  拖拽后
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el) => !!el,
      );
      console.log('Sorted items: ', newData);
      setDataSource(newData);
    }
  };


  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const components = {
    body: {
      wrapper: DraggableContainer,
      row: DraggableBodyRow,
      cell: EditableCell,
    },
  };

  const defaultColumns = [{
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (_, record, index) =><span>{index + 1}</span>,
    },
    {
      title: '动作组',
      dataIndex: 'value',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 150,
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div className="operate">
            <Popconfirm
              title="是否删除？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                handleDelete(record.key);
              }}
            >
              <Button icon={<DeleteOutlined />} size="small" className="delButton">
                删除
              </Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleAdd = () => {
    const newData = {
      key: dataSource.length + 1
    };
    setDataSource([...dataSource, newData]);
  };




  useEffect(() => {
    if (isAdd) {
      form.resetFields();
      form.setFieldsValue({
        closed: false,
      });
    } else {
      const startPositionNode = nodeData.find((item)=>{ return item.id === treeSelectInfo.startPositionId })
      const endPositionIdNode = nodeData.find((item)=>{ return item.id === treeSelectInfo.endPositionId })
      setStartPositionName(startPositionNode?.positionName)
      setEndPositionName(endPositionIdNode?.positionName)
      form.setFieldsValue({
        ...treeSelectInfo
      })
      treeSelectInfo.roadType &&  setRoadType(treeSelectInfo.roadType)
      treeSelectInfo.actionList && setDataSource(treeSelectInfo.actionList)
    }
  }, [treeSelectInfo, isAdd]);

  // 保存
  const onFinish = (value) => {
    let  payload
    if (treeSelectInfo.hierarchy === 'default'
      || treeSelectInfo.hierarchy === 'site'
      || treeSelectInfo.hierarchy === 'node') {
       payload = {
        ...value,
        agvModelIds: typeof(value.agvModelIds)=='string' ? [value.agvModelIds] : value.agvModelIds,
        mapId: mapId,
        operationsWhenEnd: treeSelectInfo.operationsWhenEnd || [],
        operationsWhenPass: treeSelectInfo.operationsWhenPass || [],
        operationsWhenStart: treeSelectInfo.operationsWhenStart || [],
        id: treeSelectInfo.id
      };
      isAdd ? dictAdd({...payload}) : dictUpdate({...payload}) 
    } else if (treeSelectInfo.hierarchy === 'path') {
      payload = {
        ...value,
        startDirection: treeSelectInfo.startDirection,
        endDirection: treeSelectInfo.endDirection,
        distance: treeSelectInfo.distance,
        direction: treeSelectInfo.direction,
        roadType,
        startPositionId: treeSelectInfo.startPositionId,
        endPositionId: treeSelectInfo.endPositionId,
        id: treeSelectInfo.id
      };
      dictRelationUpdata({...payload}) 
    } else if (treeSelectInfo.hierarchy === 'action') {
      const actionList = dataSource.map(item => {
        return item.value
      })
      payload = {
        ...treeSelectInfo.itemInfo,
      };
      if (treeSelectInfo.title === '起点动作') {
        payload['operationsWhenStart']= actionList
      } else if (treeSelectInfo.title === '路径动作') {
        payload['operationsWhenPass']= actionList
      } else {
        payload['operationsWhenEnd']= actionList
      } 
      dictUpdate({...payload}) 
    }
    
  };

  const getTreeData = () => {
    if (treeSelectInfo.canAdd) {
      return '站点'
    } else {
      if (treeSelectInfo.hierarchy==='site' || treeSelectInfo.hierarchy==='node') {
        return '站点'
      } else if (treeSelectInfo.hierarchy === 'action') {
        return '起点动作'
      } else if (treeSelectInfo.hierarchy === 'path') {
        return '路线'
      }
    }
  }
  const getDrawerTitle = () => {
    if (isAdd) {
      if (treeSelectInfo.key==='node' || treeSelectInfo.hierarchy === 'node') {
        return '新增节点'
      } else {
        return '新增站点'
      }
    } else {
      if (treeSelectInfo.hierarchy==='site') {
        return '站点配置'
      } else if ( treeSelectInfo.hierarchy==='node') {
        return '节点配置'
      } else if (treeSelectInfo.hierarchy === 'action') {
        return '动作配置'
      } else if (treeSelectInfo.hierarchy === 'path') {
        return '路线配置'
      }
    }
  }

  return (
    <Drawer
      title={getDrawerTitle()}
      placement="right"
      maskClosable={false} 
      width={treeSelectInfo.hierarchy === 'action' ? 520 : 420}
      onClose={()=>{saveModelsState({treeInfoFormVisible: false})}}
      visible={treeInfoFormVisible}
      footer={
        <div className='draw_box_footer' style={{float: 'right'}}>
          <Button size='large' style={{marginRight: '10px'}} onClick={()=>{saveModelsState({treeInfoFormVisible: false})}}>取消</Button>
          <Button size='large' type="primary" onClick={()=>{ form.submit() }}>
            确认
          </Button>
        </div>
      }
      >
       <Form
        form={form}
        labelCol= { {span: treeSelectInfo.hierarchy === 'path' ? 8 : 6 }}
        wrapperCol={{ span: 14 }}
        onFinish={onFinish}
      >
        <Form.Item label="类型" rules={[{ required: true }]}>
          <div>{getTreeData()}</div>
        </Form.Item>
        {
          (treeSelectInfo.canAdd || treeSelectInfo.hierarchy === 'site' || treeSelectInfo.hierarchy === 'node') && <div>
            
            <Form.Item name="positionName" label="名称" rules={[{ required: true }]}>
              <Input placeholder="请输入名称" />
            </Form.Item>
            <Form.Item name="closed" label="是否关闭" rules={[{ required: true }]}>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
            <Form.Item name="x" label="X" rules={[{ required: true }]}>
              <InputNumber addonAfter="m" step="0.001" precision="3" placeholder="请输入X坐标" />
            </Form.Item>
            <Form.Item name="y" label="Y" rules={[{ required: true }]}>
              <InputNumber addonAfter="m" step="0.001" precision="3" placeholder="请输入Y坐标" />
            </Form.Item>
            <Form.Item name="h" label="H" rules={[{ required: true }]}>
              <InputNumber addonAfter="°" min="-180" max="180" step="0.001" precision="3" placeholder="请输入H坐标" />
            </Form.Item>
            <Form.Item name="z" label="Z" rules={[{ required: true }]}>
              <InputNumber addonAfter="m" step="0.001" precision="3" placeholder="请输入Z坐标" />
            </Form.Item>
            <Form.Item name="positionType" label="站点类型" rules={[{ required: true }]}>
              {
                (treeSelectInfo.key==='node' || treeSelectInfo.hierarchy === 'node') ?
                <Select >
                  <Select.Option value="NORMAL">普通</Select.Option>
                </Select>
              : 
                <Select>
                  <Select.Option value="BUFFER">缓存</Select.Option>
                  <Select.Option value="CHARGING">充电</Select.Option>
                  <Select.Option value="OPERATION">操作</Select.Option>
                </Select>
              }
             
            </Form.Item>
            <Form.Item name="agvModelIds" label="车辆类型" rules={[{ required: true }]}>
              <Select mode="multiple">
                {
                  agvModelList && agvModelList.map((item)=> {
                    return <Select.Option value={item.key}>{item.value}</Select.Option>
                  })
                } 
              </Select>
            </Form.Item>  
          </div>
        }
        {
          treeSelectInfo.hierarchy === 'action' && <div>
            <Button
              onClick={handleAdd}
              type="primary"
              icon={<PlusOutlined />}
              className="addButton"
              style={{
                marginBottom: 16,
              }}
            >
             增加动作组
            </Button>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                pagination={false}
                dataSource={dataSource}
                columns={columns}
              />
          </div>
        }
        {
          treeSelectInfo.hierarchy === 'path' && <div>
            
            <Form.Item name="relationName" label="名称" rules={[{ required: true }]}>
              <Input autoComplete="off" placeholder="请输入名称" />
            </Form.Item>
            <Form.Item name="path" label="路线方向">
              <div>单向</div>
            </Form.Item>
            <Form.Item name="startPositionName" label="起点">
              <div>{startPositionName}</div>
            </Form.Item>
            <Form.Item name="endPositionName" label="终点">
              <div>{endPositionName}</div>
            </Form.Item>
            <Form.Item name="maxSpeed" label="最大速度">
              <InputNumber autoComplete="off" min={0} addonAfter="m/s" placeholder="请输入最大速度" />
            </Form.Item>
            <Form.Item name="roadType" label="路线类型" >
              <Select onChange={(value)=>{setRoadType(value)}}>
                <Select.Option value="STRAIGHT">直线</Select.Option>
                <Select.Option value="CURVE">曲线</Select.Option>
              </Select>
            </Form.Item> 
            {
              roadType === 'STRAIGHT' ?
                <div>
                  <Form.Item name="direction" label="车体朝向" rules={[{ required: true }]}>
                    <Input autoComplete="off" addonAfter="°" placeholder="请输入朝向" />
                  </Form.Item> 
                </div>
                :
                <div>
                  <Form.Item name="startDirection" label="起点车体朝向" rules={[{ required: true }]}>
                    <Input autoComplete="off" addonAfter="°" placeholder="请输入起点车体朝向" />
                  </Form.Item>
                  <Form.Item name="endDirection" label="终点车体朝向" rules={[{ required: true }]}>
                    <Input autoComplete="off" addonAfter="°" placeholder="请输入终点车体朝向" />
                  </Form.Item>
                </div>
            }
          </div>
        }
        
      </Form>
    </Drawer>
  );
};

export default EditModal;
