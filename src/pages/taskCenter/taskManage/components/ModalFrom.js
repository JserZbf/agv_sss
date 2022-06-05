import React, { useEffect, useState } from 'react';
import { Form, Modal, Select, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'dva';

const EditModal = ({ saveModelsState, agvModelList, taskTypeList }) => {

  const dispatch = useDispatch();
  const dictAdd = (payload) => dispatch({ type: 'taskManage/dictAdd', payload });
  const dictUpdate = (payload) => dispatch({ type: 'taskManage/dictUpdate', payload });

  const { visible, isAdd, storeData, agvPositonList } = useSelector(
    (models) => models.taskManage,
  );
  const [form] = Form.useForm();

  const [startPositionInfo , setStartPositionInfo ] = useState({})
  const [endPositionInfo , setEndPositionInfo ] = useState({})

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
      form.setFieldsValue({taskType: 'MOVE', priority: 6})
    } else {
      form.setFieldsValue({...storeData})
      setStartPositionInfo({
        value: storeData?.startPositionId,
        label: storeData?.startPositionName
      })
      setEndPositionInfo({
        value: storeData?.endPositionId,
        label: storeData?.endPositionName
      })
    }
  }, [storeData, isAdd]);

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  const onFinish = (value) => {
    let payload = {
      ...value,
      startPositionId: startPositionInfo.value,
      endPositionId: endPositionInfo.value,
      taskCode: storeData?.taskCode
    };
    if (!isAdd) {
      payload = {
        ...payload,
        id: storeData?.id,
        taskCode: storeData?.taskCode
      }
    }
    isAdd ? dictAdd({...payload}) : dictUpdate({...payload})
  };

  return (
    <Modal
      title={isAdd ? '创建数据' : '编辑数据'}
      visible={visible}
      getContainer={false}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        saveModelsState({ visible: false });
      }}
    >
      <Form
        form={form}
        {...layout}
        onFinish={onFinish}
      >
        <Form.Item name="taskType" label="任务类型" rules={[{ required: true }]}>
          <Select>
            {
              taskTypeList && taskTypeList.map(item=> {
                return <Select.Option value={item.key}>{item.value}</Select.Option>
              })
            }
          </Select>
        </Form.Item>
        
        <Form.Item name="expectedAgvModelId" label="AGV类型" rules={[{ required: true }]}>
          <Select>
            {
              agvModelList && agvModelList.map(item=> {
                return <Select.Option value={item.key}>{item.value}</Select.Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="起点" rules={[{ required: true }]}>
          <Select value={startPositionInfo} onSelect={(value, info)=>{
             setStartPositionInfo({
              value,
              label: info.children
            })
          }}>
            {
              agvPositonList && agvPositonList.map(item=> {
                return <Select.Option value={item.key}>{item.value}</Select.Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="终点" rules={[{ required: true }]}>
          <Select value={endPositionInfo} onSelect={(value, info)=>{
             setEndPositionInfo({
              value,
              label: info.children
            })
          }}>
            {
              agvPositonList && agvPositonList.map(item=> {
                return <Select.Option value={item.key}>{item.value}</Select.Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item name="priority" label="任务优先级" rules={[{ required: true }]}>
          <InputNumber autoComplete="off" min={0} max={10} placeholder="请输入任务优先级" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
