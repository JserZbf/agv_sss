import React, { useEffect, useState } from 'react';
import { Form, Modal, Select } from 'antd';
const EditModal = ({ isAdd, visible, saveModelsState, dictAdd, storeData }) => {

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };
  const [form] = Form.useForm();
  const onFinish = (value) => {
    const payload = {
      ...value,
      imageId: 0,
    };
    dictAdd({...payload})
  };


  const getBase64 = (img, callback)=> {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  return (
    <Modal
      title={'挂载地点'}
      visible={visible}
      getContainer={false}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        saveModelsState({ mountVisible: false });
      }}
    >
      <Form
        form={form}
        {...layout}
        onFinish={onFinish}
      >
        <Form.Item name="agvModelName" label="挂载地点" rules={[{ required: true }]}>
          <Select>
              <Select.Option value="ordinary">普通</Select.Option>
              <Select.Option value="cache">缓存</Select.Option>
              <Select.Option value="charging">充电</Select.Option>
            </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
