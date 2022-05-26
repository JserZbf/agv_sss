import React from 'react';
import { Form, Modal, Input } from 'antd';
import { keys } from 'lodash-es';

const AddFrom = ({ isAdd, addFormvisible, saveModelsState, storeData }) => {
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
      title={'创建数据'}
      visible={addFormvisible}
      getContainer={false}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        saveModelsState({ addFormvisible: false });
      }}
    >
      <Form
        form={form}
        {...layout}
        onFinish={onFinish}
      >
        <Form.Item name="code" label="动作组名称" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输动作组名称" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input autoComplete="off" placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFrom;
