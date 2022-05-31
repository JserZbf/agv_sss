import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Row, Col, InputNumber, Button, DatePicker } from 'antd';
import {
  UpOutlined,
  SearchOutlined,
  DownOutlined
} from '@ant-design/icons';
import styles from './index.less';

const SearchSel = ({ columns, selForm, onFinishSel }) => {

  const [expand, setExpand] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const { Option } = Select;

  useEffect(() => {
    setSearchData(columns.filter((item) => item.flag))
  }, [columns]);

  const renderFrom = (item) => {
    let childNode = null
    switch(item.type) {
      case 'number':
        childNode = <InputNumber placeholder={`请输入${item?.title}`} style={{ width: '100%' }} />
        break;
      case 'select':
        const showOptionKey =item?.showOption?.key || 'key';
        const showOptionContent = item?.showOption?.content || 'value';
        childNode = <Select
                      placeholder={`请选择${item?.title}`}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      style={{ width: '100%' }}
                    >
                      {item?.data?.map((dataItem) => {
                        return (
                          <Option key={dataItem[showOptionKey]} value={dataItem[showOptionKey]}>
                            {dataItem[showOptionContent]}
                          </Option>
                        );
                      })}
                    </Select>
        break;
      case 'datePicker':
          childNode = <DatePicker />
          break;
      default:
        childNode = <Input placeholder={`请输入${item?.title}`} style={{ width: '100%' }} />
    }
    return childNode
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
          {
           (expand ? searchData: searchData.slice(0,3)).map(item=> {
             return (
              <Col span={6} style={{ marginBottom: expand ? '10px' : '0px' }} key={item.key}>
                <Form.Item label={`${item.title}`} name={`${item.key}`}>
                    {renderFrom(item)}
                </Form.Item>
              </Col>
             )
           })
          }
          <div className={styles.flexRight}>
            <Col>
              <Form.Item>
                <div className={styles.buttonPosition}>
                  {
                  searchData.length > 3 && <a
                    onClick={() => {
                      setExpand(!expand);
                    }}
                    role="button"
                    className={styles.expand}
                  >
                    {expand ? `收起高级搜索` : `展开高级搜索`}
                    {expand ? (
                      <UpOutlined />
                    ) : (
                      <DownOutlined />
                    )}
                  </a>
                  }
                  <Button
                  className="buttonStyle"
                  type="primary"
                  onClick={() => {
                    onFinishSel();
                  }}
                  icon={<SearchOutlined />}
                >
                  搜索
                </Button>
                </div>
              </Form.Item>
            </Col>
          </div>
        </Form>
      </Row>
    </div>
  );
};

export default SearchSel;
