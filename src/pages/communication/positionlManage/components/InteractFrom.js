import React, { useEffect } from 'react';
import { Form, Modal, Input } from 'antd';
import { useSelector, useDispatch } from 'dva';

const EditModal = ({ saveModelsState }) => {

  const dispatch = useDispatch();
  const dictInteract = (payload) => dispatch({ type: 'positionlManage/dictInteract', payload });

  const { interactVisible, storeData } = useSelector(
    (models) => models.positionlManage,
  );

  
  const [form] = Form.useForm();

  useEffect(() => {
      form.setFieldsValue({...storeData})
  }, [storeData]);

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  const onFinish = (value) => {
    const payload = {
      ...value,
      interactKey: storeData?.interactKey,
      machineId: storeData?.machineId
    };
    dictInteract({...payload})
  };

  return (
    <Modal
      title={'编辑交互值'}
      visible={interactVisible}
      getContainer={false}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        saveModelsState({ interactVisible: false });
      }}
    >
      <Form
        form={form}
        {...layout}
        onFinish={onFinish}
      >
        <Form.Item name="interactValue" label="交互值" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入交互值" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
