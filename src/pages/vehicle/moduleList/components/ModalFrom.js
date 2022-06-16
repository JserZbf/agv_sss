import React, { useState } from 'react';
import { Form, Modal, Input, Upload, InputNumber } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'dva';

const EditModal = ({ saveModelsState }) => {

  const dispatch = useDispatch();
  const dictAdd = (payload) => dispatch({ type: 'vehicleModuleList/dictAdd', payload });

  const { visible, isAdd } = useSelector(
    (models) => models.vehicleModuleList,
  );


  const [lowBatteryStandard, setLowBatteryStandard] = useState();
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
      lowBatteryStandard,
      imageId: 1,
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
          <InputNumber autoComplete="off" step="0.1" placeholder="请输入控制精度" min={0} max={1}/>
        </Form.Item>
        <Form.Item label="AGV低电量标准" rules={[{ required: true }]}  >
          <InputNumber autoComplete="off" step="0.1" onPressEnter={(value)=> {
              if ( 0 < value && value <= 1) {
                setLowBatteryStandard(value)
              }
            }}
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
