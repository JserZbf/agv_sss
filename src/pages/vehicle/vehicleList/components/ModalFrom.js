import React from 'react';
import { Form, Modal, Input, InputNumber, Select} from 'antd';
import { useSelector, useDispatch } from 'dva';

const { TextArea } = Input;
const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
};

const EditModal = ({ saveModelsState, agvModelList, agvPositonList }) => {
  const dispatch = useDispatch();
  const dictAdd = (payload) => dispatch({ type: 'vehicleList/dictAdd', payload });

  const {  visible } = useSelector(
    (models) => models.vehicleList,
  );

  const [form] = Form.useForm();
  const onFinish = (value) => {
    const payload = {
      ...value,
    };
    dictAdd({...payload})
  };

  return (
    <Modal
      title={'创建数据'}
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
        <Form.Item name="agvName" label="AGV名称" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入AGV名称" />
        </Form.Item>
        <Form.Item name="agvModelId" label="车辆类型" placeholder="请选择车辆类型" rules={[{ required: true }]}>
          <Select>
            {
              agvModelList && agvModelList.map(item=> {
                return <Select.Option value={item.key}>{item.value}</Select.Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item name="positionId" label="所在节点" rules={[{ required: true }]}>
          <Select>
            {
              agvPositonList && agvPositonList.map(item=> {
                return <Select.Option value={item.key}>{item.value}</Select.Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item name="acceleration" label="AGV加速度" rules={[{ required: true }]}>
          <InputNumber autoComplete="off" min={0} max={1} placeholder="请输入AGV加速度" />
        </Form.Item>
        <Form.Item name="agvIp" label="IP地址" rules={[{ required: true }]}>	
          <Input autoComplete="off" placeholder="请输入IP地址" />
        </Form.Item>
        <Form.Item name="agvPrecision" label="控制精度" rules={[{ required: true }]}>
          <InputNumber autoComplete="off" min={0} max={1} placeholder="请输入控制精度" />
        </Form.Item>
        <Form.Item name="lowBatteryStandard" label="AGV低电量标准" rules={[{ required: true }]}>
          <InputNumber autoComplete="off" min={0} max={1} placeholder="请输入AGV低电量标准" />
        </Form.Item>
        <Form.Item name="weight" label="AGV自重" rules={[{ required: true }]}>
          <InputNumber autoComplete="off" placeholder="请输入AGV自重"/>
        </Form.Item>
        <Form.Item name="maxSpeed" label="AGV的最大速度" rules={[{ required: true }]}>
          <InputNumber autoComplete="off" min={0} max={1} placeholder="请输入AGV最大速度" />
        </Form.Item>
        <Form.Item name="avoidance" label="避障等级" rules={[{ required: true }]}>
          <InputNumber autoComplete="off" placeholder="请输入避障等级" />
        </Form.Item>
        <Form.Item name="agvDescription" label="备注">
          <TextArea rows={4} placeholder="请输入备注"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
