import React, { useState } from 'react';
import { Form, Input, Select, Row, Col, InputNumber } from 'antd';
import Iconfont from 'components/Iconfont';
import styles from './index.less';

const Remodels = ({ advancedSearch, columns, selForm, selButton }) => {
  const [expand, setExpand] = useState(false);
  const { Option } = Select;

  const renderFrom = (data) => {
    const searchData = data?.filter((item) => item.flag);
    const count = expand ? searchData.length : 3;
    const children = [];
    for (let i = 0; i < count; i++) {
      if (searchData[i]?.flag) {    
        const showOptionKey = searchData[i]?.showOption?.key;
        const showOptionContent = searchData[i]?.showOption?.content;
        children.push(
          searchData[i]?.data ? (
            <Col span={6} style={{ marginBottom: expand ? '10px' : '0px' }} key={i}>
              <Form.Item label={`${searchData[i]?.title}`} name={`${searchData[i]?.key}`}>
                <Select
                  placeholder={`请选择${searchData[i]?.title}`}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                >
                  {searchData[i].data?.map((item) => {
                    return (
                      <Option key={item[showOptionKey]} value={item[showOptionKey]}>
                        {item[showOptionContent]}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          ) : searchData[i]?.datePicker ? (
            <Col span={6} style={{ marginBottom: expand ? '10px' : '0px' }} key={i}>
              <Form.Item label={`${searchData[i]?.title}`} name={`${searchData[i]?.key}`}>
                {searchData[i]?.datePicker}
              </Form.Item>
            </Col>
          ) : searchData[i]?.type ==='number' ? (
            <Col span={6} style={{ marginBottom: expand ? '10px' : '0px' }} key={i}>
              <Form.Item label={`${searchData[i]?.title}`} name={`${searchData[i]?.key}`}>
                <InputNumber placeholder={`请输入${searchData[i]?.title}`} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          ) : (
            <Col span={6} style={{ marginBottom: expand ? '10px' : '0px' }} key={i}>
              <Form.Item label={`${searchData[i]?.title}`} name={`${searchData[i]?.key}`}>
                <Input placeholder={`请输入${searchData[i]?.title}`} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          )
        );
      }
    }
    return children;
  };

  return (
    <div className={styles.searchBox}>
      <Row style={{ width: '100%' }}>
        <Form
          style={{ width: '100%' }}
          name="basic"
          layout="inline"
          autoComplete="off"
          form={selForm}
        >
          {renderFrom(columns)}
          <div className={styles.flexRight}>
            <Col>
              <Form.Item>
                <div className={styles.buttonPosition}>
                  {advancedSearch && (
                    <>
                      <a
                        onClick={() => {
                          setExpand(!expand);
                        }}
                        role="button"
                        className={styles.expand}
                      >
                        {expand ? `收起高级搜索` : `展开高级搜索`} &nbsp;
                        {expand ? (
                          <Iconfont
                            iconMode="unicode"
                            type="icon-xiangshangzhanhang"
                            className="prefixIcon"
                          />
                        ) : (
                          <Iconfont
                            iconMode="unicode"
                            type="icon-xiangxiazhanhang"
                            className="prefixIcon"
                          />
                        )}
                      </a>
                      {/* <Button
                        icon={<UndoOutlined />}
                        onClick={() => {
                          selForm.resetFields();
                        }}
                      /> */}
                    </>
                  )}
                  {selButton}
                </div>
              </Form.Item>
            </Col>
          </div>
        </Form>
      </Row>
    </div>
  );
};

export default Remodels;
