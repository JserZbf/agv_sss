import React, { useEffect, useRef, useState, useContext } from 'react';
import { Form, Modal, Table, Button, Popconfirm, Input, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from '../index.less';

const EditModal = ({ isAdd, visible, saveModelsState, storeData }) => {

  const EditableContext = React.createContext(null);

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  const [dataSource, setDataSource] = useState([
    {
      key: '0',
      name: '动作名称1',
      param1: '32',
      value1: '参数',
    },
    {
      key: '1',
      name: '动作名称2',
      param1: '32',
      value1: '参数',
    },
  ]);

  let allcolumns = [
    {
      title: '子动作名称',
      dataIndex: 'name',
      editable: true,
      with: '15%',
      dataType: 'input'
    },
    {
      title: '参数1',
      dataIndex: 'param1',
      editable: true,
      dataType: 'select'
    },
    {
      title: '值1',
      dataIndex: 'value1',
      editable: true,
    },
    {
      title: '参数2',
      dataIndex: 'param2',
      editable: true,
    },
    {
      title: '值2',
      dataIndex: 'value2',
      editable: true,
      dataType: 'select'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record, index) =>
        dataSource.length >= 1 ? (
          <div className="operate">
            <Popconfirm
              title="是否删除？"
              okText="确定"
              onConfirm={() => handleDelete(index)}
            >
              <Button icon={<DeleteOutlined />} size="small" className="delButton">
                  删除
              </Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    dataType,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
      console.log(form.getFieldsValue(),'jieguo')
    }, [editing]);

    useEffect(() => {
      console.log(record,dataIndex,'dataIndex')
      form.setFieldsValue({...record})
    }, []);
  
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    
    let childNode = children;
    if (editable) {
      childNode =  <div>
      {
        dataType === 'select' ? 
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title}必填`,
            },
          ]}
        >
          <Select style={{minWidth: '100px'}} ref={inputRef} onBlur={save}>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        :  
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title}必填`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      }
    </div>
    }
  
    return <td {...restProps}>{childNode}</td>;
  };


  const handleDelete = (index) => {
    let newDataSource = [...dataSource];
    newDataSource.splice(index,1)
    setDataSource(newDataSource)
  };
 const handleAdd = () => {
    const newData = {
      key: dataSource.length,
      name: '',
      age: '',
      address: '',
    };
    setDataSource([...dataSource, newData])
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    console.log(newData,'xnde')
    setDataSource(newData)
  };

  const [form] = Form.useForm();
  const onFinish = (value) => {
    const payload = {
      ...value,
      layer: storeData.layer,
      parentId: storeData.parentId,
    };
  };

  const columns = allcolumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataType: col.dataType,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <Modal
      title={`配置动作组：`}
      visible={visible}
      width={800}
      getContainer={false}
      onOk={() => {
        console.log(dataSource,'列表数据')
      }}
      onCancel={() => {
        saveModelsState({ visible: false });
      }}
    >
      <div>
        <Table
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            }
          }}
          pagination={false}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
          <Button
            onClick={handleAdd}
            type="primary"
            className={styles.add_child_table}
          >
            新增
          </Button>
      </div>
    </Modal>
  );
};

export default EditModal;
