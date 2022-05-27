import React, { useEffect, useState } from 'react';
import { Form, Modal, Input, Upload, InputNumber } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { keys } from 'lodash-es';

const EditModal = ({ isAdd, visible, saveModelsState, dictAdd, storeData }) => {

  const [loading, setLoading] = useState('');
  const [imageUrl, setImageUrl] = useState('');

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
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );


  const getBase64 = (img, callback)=> {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  const beforeUpload = (file)=> {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
       {
        setLoading(false)
        setImageUrl(imageUrl)
       }
      );
    }
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
        <Form.Item name="agvModelName" label="AGV模型名称" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入AGV模型名称" />
        </Form.Item>
        <Form.Item name="supplierName" label="AGV供应商名称" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入AGV供应商名称" />
        </Form.Item>
        <Form.Item name="agvPrecision" label="控制精度" rules={[{ required: true }]}>
          <InputNumber autoComplete="off" placeholder="请输入控制精度" min={0} max={1}/>
        </Form.Item>
        <Form.Item name="lowBatteryStandard" label="AGV低电量标准" rules={[{ required: true }]}>
          <InputNumber autoComplete="off" placeholder="请输入AGV低电量标准" />
        </Form.Item>
        {/* <Form.Item name="description" label="图片" rules={[{ required: true }]}>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default EditModal;