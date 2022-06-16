import React, { useEffect } from 'react';
import { Form, Modal, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'dva';

const ParameFrom = ({ saveModelsState, agvInfo }) => {
  const dispatch = useDispatch();
  const dictUpdate = (payload) => dispatch({ type: 'vehicleList/dictUpdate', payload });

  const {  parameVisible } = useSelector(
    (models) => models.vehicleList,
  );
  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };
  const [form] = Form.useForm();
  const onFinish = (value) => {
    const payload = {
      acceleration: value.acceleration,
      agvIp: agvInfo.agvIp,
      agvModelId: agvInfo.agvModelId,
      agvName: agvInfo.agvName,
      agvPrecision: agvInfo.agvPrecision,
      agvState: agvInfo.agvState,
      avoidance: agvInfo.avoidance,
      id: agvInfo.id,
      lowBatteryStandard: agvInfo.lowBatteryStandard,
      maxSpeed: value.maxSpeed,
      taskId: agvInfo.taskId,
      weight: agvInfo.weight,
    };
    dictUpdate({...payload})
  };
  useEffect(() => {
    form.setFieldsValue({
      acceleration: agvInfo.acceleration,
      maxSpeed: agvInfo.maxSpeed
    })
}, [agvInfo]);

  return (
    <Modal
      title={'配置信息'}
      visible={parameVisible}
      getContainer={false}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        saveModelsState({ parameVisible: false });
      }}
    >
      <Form
        form={form}
        {...layout}
        onFinish={onFinish}
      >
        <Form.Item name="acceleration" label="AGV加速度" rules={[{ required: true }]}>
          <InputNumber autoComplete="off" addonAfter="m/s" min={0} placeholder="请输入AGV加速度" />
        </Form.Item>
        <Form.Item name="maxSpeed" label="AGV的最大速度" rules={[{ required: true }]}>
          <InputNumber autoComplete="off" addonAfter="m/s" min={0} placeholder="请输入AGV最大速度" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ParameFrom;
