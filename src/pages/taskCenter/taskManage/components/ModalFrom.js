import React, { useEffect, useState } from 'react';
import { Form, Modal, Input, Select } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { keys } from 'lodash-es';

const EditModal = ({ isAdd, visible, saveModelsState,dictAdd, dictUpdate, storeData, taskStates,dictAgvPosition, agvModelList, agvPositonList }) => {
  
  const [form] = Form.useForm();

  const [agvValue, setAgvValue] = useState('')

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    } else {
      console.log(storeData,'数据')
      form.setFieldsValue({...storeData})
    }
  }, [storeData, isAdd]);

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  const onFinish = (value) => {
    const payload = {
      ...storeData,
      ...value,
      updateTime: +new Date
    };
    console.log(payload,'保存数据')
    // isAdd ? dictAdd({...payload}) : dictUpdate({...payload})
  };

  const changeAgvValue = (key) => {
    console.log(key,'key')
    dictAgvPosition({mapId: key})
    setAgvValue(key)
  }

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
        {/* <Form.Item name="taskCode" label="任务编号" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入任务编号" />
        </Form.Item> */}
        {/* <Form.Item name="priority" label="任务优先级" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入任务优先级" />
        </Form.Item> */}
        {/* <Form.Item name="taskType" label="任务类型" rules={[{ required: true }]}>    
          <Select>
          {
            taskStates && taskStates.map(item=> {
              return <Select.Option value={item.key}>{item.value}</Select.Option>
            })
          }
          </Select>
        </Form.Item> */}
        
        <Form.Item name="expectedAgvModelId" label="AGV类型" rules={[{ required: true }]}>
          <Select onSelect={changeAgvValue}>
            {
              agvModelList && agvModelList.map(item=> {
                return <Select.Option value={item.key}>{item.value}</Select.Option>
              })
            }
          </Select>
        </Form.Item>
        {
          agvValue && <div>
            <Form.Item name="startPositionId" label="起点" rules={[{ required: true }]}>
              <Select>
                {
                  agvPositonList && agvPositonList.map(item=> {
                    return <Select.Option value={item.key}>{item.value}</Select.Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item name="endPositionId" label="终点" rules={[{ required: true }]}>
             <Select>
                {
                  agvPositonList && agvPositonList.map(item=> {
                    return <Select.Option value={item.key}>{item.value}</Select.Option>
                  })
                }
              </Select>
            </Form.Item>
          </div>
        }
        <Form.Item name="priority" label="任务优先级" rules={[{ required: true }]}>
          <Input autoComplete="off" placeholder="请输入任务优先级" />
        </Form.Item>
        {/* <Form.Item name="taskState" label="任务状态" rules={[{ required: true }]}>
          <Select>
            {
              taskStates && taskStates.map(item=> {
                return <Select.Option value={item.key}>{item.value}</Select.Option>
              })
            }
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default EditModal;
