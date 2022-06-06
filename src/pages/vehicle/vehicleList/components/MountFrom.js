import React, { useEffect } from 'react';
import { Form, Modal, Select } from 'antd';
import { useSelector, useDispatch } from 'dva';

const MountFrom = ({saveModelsState, agvPositonList, agvInfo }) => {
  const dispatch = useDispatch();
  const dicMount = (payload) => dispatch({ type: 'vehicleList/dicMount', payload });
  const {  mountVisible } = useSelector(
    (models) => models.vehicleList,
  );

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  useEffect(() => {
      form.setFieldsValue({positionId: agvInfo.positionId})
  }, [agvInfo]);

  const [form] = Form.useForm();
  const onFinish = (value) => {
    const payload = {
      ...value,
      agvId: agvInfo.id
    };
    dicMount({...payload})
  };

  return (
    <Modal
      title='挂载地点'
      visible={mountVisible}
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
        <Form.Item name="positionId" label="挂载地点" rules={[{ required: true }]}>
         <Select>
            {
              agvPositonList && agvPositonList.map(item=> {
                return <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
              })
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MountFrom;
