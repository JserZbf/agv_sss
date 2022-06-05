import React, { useEffect } from 'react';
import { Form, Modal, Input } from 'antd';
import { useSelector, useDispatch } from 'dva';

const { TextArea } = Input;

const EditModal = ({ saveModelsState }) => {

  const dispatch = useDispatch();  
  const dictAdd = (payload) => dispatch({ type: 'mapList/dictAdd', payload });
  const dictUpdate = (payload) => dispatch({ type: 'mapList/dictUpdate', payload });

  const {  isAdd, visible, storeData } = useSelector(
    (models) => models.mapList,
  );

  
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
      form.setFieldsValue({used: false})
    } else {
      const checkValue = {
        ...storeData,
        used: !!storeData?.used
      }
      form.setFieldsValue({...checkValue})
    }
  }, [storeData, isAdd]);

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  const onFinish = (value) => {
    const payload = {
      ...storeData,
      ...value
    };
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
        <Form.Item name="mapName" label="地图名称" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入地图名称" />
        </Form.Item>
        <Form.Item name="mapDescription" label="描述">
          <TextArea rows={4} placeholder="请输入备注"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
