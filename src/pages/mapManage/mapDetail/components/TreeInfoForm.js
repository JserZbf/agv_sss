import React, { useEffect, useState } from 'react';
import { Form, Drawer, Input, Select, Button, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'dva';

const EditModal = ({
  mapId,
  dictAdd,
  dictUpdate,
  saveModelsState,
  nodeData,  
}) => {

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const [form] = Form.useForm();


  const dispatch = useDispatch();
  const dictRelationUpdata = (payload) => dispatch({ type: 'mapDetail/dictRelationUpdata', payload });

  const { isAdd, treeSelectInfo, treeInfoFormVisible, agvModelList } = useSelector(
    (models) => models.mapDetail,
  ); 

  
  const [startPositionName, setStartPositionName] = useState('')
  const [endPositionName, setEndPositionName] = useState('')


  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    } else {
      const startPositionNode = nodeData.find((item)=>{ return item.id === treeSelectInfo.startPositionId })
      const endPositionIdNode = nodeData.find((item)=>{ return item.id === treeSelectInfo.endPositionId })
      setStartPositionName(startPositionNode?.positionName)
      setEndPositionName(endPositionIdNode?.positionName)
      form.setFieldsValue({
        ...treeSelectInfo
      })
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
        closed: true,
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
        roadType: treeSelectInfo.roadType,
        startPositionId: treeSelectInfo.startPositionId,
        endPositionId: treeSelectInfo.endPositionId,
        id: treeSelectInfo.id
      };
      dictRelationUpdata({...payload}) 
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
      return '新增节点'
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
      width={420}
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
        {...layout}
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
            <Form.Item name="x" label="X" rules={[{ required: true }]}>
              <InputNumber addonAfter="m" placeholder="请输入X坐标" />
            </Form.Item>
            <Form.Item name="y" label="Y" rules={[{ required: true }]}>
              <InputNumber addonAfter="m" placeholder="请输入Y坐标" />
            </Form.Item>
            <Form.Item name="h" label="H">
              <InputNumber addonAfter="m" placeholder="请输入H坐标" />
            </Form.Item>
            <Form.Item name="z" label="Z">
              <InputNumber addonAfter="m" placeholder="请输入Z坐标" />
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
              <Select>
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
          treeSelectInfo.hierarchy === 'normal' && <div>
            <Form.Item name="actionArray" label="动作组" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="ordinary">换刀</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="actionSignal" label="请求动作信号" >
              <Select>
                <Select.Option value="ordinary">agv-&gt;设备</Select.Option>
              </Select>
            </Form.Item>  
            <Form.Item name="actionSignal" label="请求动作信号" >
              <Select>
                <Select.Option value="ordinary">agv-&gt;设备</Select.Option>
              </Select>
            </Form.Item>  
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
            <Form.Item name="roadType" label="路线类型" >
              <Select>
                <Select.Option value="STRAIGHT">直线</Select.Option>
                <Select.Option value="CURVE">曲线</Select.Option>
              </Select>
            </Form.Item>  
            {
              form.getFieldValue('roadType') === 'STRAIGHT' ?
                <div>
                  <Form.Item name="direction" label="车体朝向" rules={[{ required: true }]}>
                    <Input autoComplete="off" addonAfter="度" placeholder="请输入朝向" />
                  </Form.Item> 
                </div>
                :
                <div>
                  <Form.Item name="startDirection" label="起点车体朝向" rules={[{ required: true }]}>
                    <Input autoComplete="off" addonAfter="度" placeholder="请输入起点车体朝向" />
                  </Form.Item>
                  <Form.Item name="endDirection" label="终点车体朝向" rules={[{ required: true }]}>
                    <Input autoComplete="off" addonAfter="度" placeholder="请输入终点车体朝向" />
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
