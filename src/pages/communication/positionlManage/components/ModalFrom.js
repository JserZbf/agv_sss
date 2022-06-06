import React, { useEffect, useState } from 'react';
import { Form, Modal, Input } from 'antd';
import { useSelector, useDispatch } from 'dva';

const EditModal = ({ saveModelsState}) => {

  const dispatch = useDispatch();  
  const dictAdd = (payload) => dispatch({ type: 'positionlManage/dictAdd', payload });
  const dictUpdate = (payload) => dispatch({ type: 'positionlManage/dictUpdate', payload });

  const {  isAdd, visible, storeData } = useSelector(
    (models) => models.positionlManage,
  );

  
  const [form] = Form.useForm();

  const [startPositionInfo , setStartPositionInfo ] = useState({})
  const [endPositionInfo , setEndPositionInfo ] = useState({})

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
      form.setFieldsValue({taskType: 'MOVE'})
    } else {
      form.setFieldsValue({...storeData})
      setStartPositionInfo({
        value: storeData.startPositionId,
        label: storeData.startPositionName
      })
      setEndPositionInfo({
        value: storeData.endPositionId,
        label: storeData.endPositionName
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
        <Form.Item name="interactName" label="交互点位名称" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入交互点位名称" />
        </Form.Item>
        <Form.Item name="interactKey" label="交互点位" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入交互点位" />
        </Form.Item>
        <Form.Item name="expectedValue" label="期望值" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入期望值" />
        </Form.Item>
        <Form.Item name="interactType" label="交互类型" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入交互类型" />
        </Form.Item>
        <Form.Item name="interactValue" label="交互值" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入交互值" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
