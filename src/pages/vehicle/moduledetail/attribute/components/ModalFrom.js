import React, { useEffect, useState } from 'react';
import { Form, Modal, Input, InputNumber, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const EditModal = ({ visible, saveModelsState, storeData, dictUpdate }) => {
  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };
  const [form] = Form.useForm();

  const [lowBatteryStandard, setLowBatteryStandard] = useState();
  const [loading, setLoading] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const checkValue = {
      ...storeData
    }
    setLowBatteryStandard(storeData.lowBatteryStandard)
    form.setFieldsValue({...checkValue})
  }, [storeData]);

  const onFinish = (value) => {
    const payload = {
      ...value,
      imageId: storeData.imageId,
      id: storeData.id,
      lowBatteryStandard: lowBatteryStandard
    };
    dictUpdate({...payload})
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

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
      title={'编辑数据'}
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
          <InputNumber autoComplete="off" placeholder="请输入控制精度" step="0.1" min={0} max={1}/>
        </Form.Item>
        <Form.Item label="AGV低电量标准"  rules={[{ required: true }]} >
          <InputNumber autoComplete="off" onPressEnter={(value)=> {
              if ( 0 < value && value <= 1) {
                setLowBatteryStandard(value)
              }
            }} 
            onStep={(value)=> {
              if ( 0 < value && value <= 1) {
                setLowBatteryStandard(value)
              }
            }} 
            step="0.1"
            min={0} max={1}
            value={lowBatteryStandard}
            placeholder="请输入AGV低电量标准"
          />
        </Form.Item>
        {/* <Form.Item name="description" label="图片" rules={[{ required: true }]}>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://pg.sh-smartstate.com.cn/api/fileserver/filesServer/upload"
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
