import React from 'react';
import { Form, Modal, Input } from 'antd';
import { keys } from 'lodash-es';

const EditModal = ({ isAdd, visible, saveModelsState, storeData }) => {
  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };
  const [form] = Form.useForm();
  const onFinish = (value) => {
    const payload = {
      ...value,
      layer: storeData.layer,
      parentId: storeData.parentId,
    };
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
        <Form.Item name="code" label="编码" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入编码" />
        </Form.Item>
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入名称" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input autoComplete="off" placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
