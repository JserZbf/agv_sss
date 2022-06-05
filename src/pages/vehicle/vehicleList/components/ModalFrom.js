import React, { useEffect } from 'react';
import { Form, Modal, Input, InputNumber, Select, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'dva';
import styles from '../index.less';

const { TextArea } = Input;

const EditModal = ({ saveModelsState, agvModelList, agvPositonList }) => {
  const dispatch = useDispatch();
  const dictAdd = (payload) => dispatch({ type: 'vehicleList/dictAdd', payload });
  const dictUpdate = (payload) => dispatch({ type: 'vehicleList/dictUpdate', payload });

  const {  visible, agvInfo, isAdd } = useSelector(
    (models) => models.vehicleList,
  );

  const [form] = Form.useForm();

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    } else {
      form.setFieldsValue({...agvInfo})
    }
  }, [agvInfo, isAdd]);

  const onFinish = (value) => {
    const payload = {
      ...agvInfo,
      ...value,
    };
    isAdd ? dictAdd({...payload}): dictUpdate({...payload})
  };

  return (
    <Modal
      title={isAdd ? '创建车辆' : '编辑车辆'}
      visible={visible}
      getContainer={false}
      width={800}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        saveModelsState({ visible: false });
      }}
    > 
      <Row style={{ width: '100%' }}>
        <Form
          form={form}
          // {...layout}
          layout='inline'
          onFinish={onFinish}
        >
          <Col span="12" className={styles.addFormcol} >
            <Form.Item name="agvName" label="AGV名称" rules={[{ required: true }]}>
              <Input autoComplete="off" placeholder="请输入AGV名称" />
            </Form.Item>
          </Col>
          <Col span="12" className={styles.addFormcol}>
            <Form.Item name="agvModelId" label="车辆类型" rules={[{ required: true }]}>
              <Select placeholder="请选择车辆类型" >
                {
                  agvModelList && agvModelList.map(item=> {
                    return <Select.Option value={item.key}>{item.value}</Select.Option>
                  })
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span="12" className={styles.addFormcol}>
            <Form.Item name="positionId" label="所在节点" rules={[{ required: true }]}>
              <Select placeholder="请选择所在节点" >
                {
                  agvPositonList && agvPositonList.map(item=> {
                    return <Select.Option value={item.key}>{item.value}</Select.Option>
                  })
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span="12" className={styles.addFormcol}>
            <Form.Item name="acceleration" label="AGV加速度" rules={[{ required: true }]}>
              <InputNumber autoComplete="off" min={0} max={1} placeholder="请输入AGV加速度" />
            </Form.Item>
          </Col>
          <Col span="12" className={styles.addFormcol}>
            <Form.Item name="agvIp" label="IP地址" rules={[{ required: true }]}>	
              <Input autoComplete="off" placeholder="请输入IP地址" />
            </Form.Item>
          </Col>
          <Col span="12" className={styles.addFormcol}>
            <Form.Item name="agvPrecision" label="控制精度" rules={[{ required: true }]}>
              <InputNumber autoComplete="off" min={0} max={1} placeholder="请输入控制精度" />
            </Form.Item>
          </Col>
          <Col span="12" className={styles.addFormcol}>
            <Form.Item name="lowBatteryStandard" label="AGV低电量标准" rules={[{ required: true }]}>
              <InputNumber autoComplete="off" min={0} max={1} placeholder="请输入AGV低电量标准" />
            </Form.Item>
          </Col>
          <Col span="12" className={styles.addFormcol}>
            <Form.Item name="weight" label="AGV自重" rules={[{ required: true }]}>
              <InputNumber autoComplete="off" placeholder="请输入AGV自重"/>
            </Form.Item>
          </Col>
          <Col span="12" className={styles.addFormcol}>
            <Form.Item name="maxSpeed" label="AGV的最大速度" rules={[{ required: true }]}>
              <InputNumber autoComplete="off" min={0} max={1} placeholder="请输入AGV最大速度" />
            </Form.Item>
          </Col>
          <Col span="12" className={styles.addFormcol}>
            <Form.Item name="avoidance" label="避障等级" rules={[{ required: true }]}>
              <InputNumber autoComplete="off" placeholder="请输入避障等级" />
            </Form.Item>
          </Col>
          <Col span="12" className={styles.addFormcol}>
            <Form.Item name="agvDescription" label="备注">
              <TextArea rows={4} placeholder="请输入备注"/>
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </Modal>
  );
};

export default EditModal;
