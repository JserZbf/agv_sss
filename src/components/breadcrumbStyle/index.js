import React from 'react';
import { Breadcrumb } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import history from 'common/history';
import styles from './index.less';

const Index = ({ aheadTitle, currentTitle }) => {
  return (
    <div className={styles.breadcrumbStyle}>
      <div className={styles.titleIcon}>
        <ArrowLeftOutlined onClick={() => history.goBack()} />
        {/* <ArrowLeftOutlined /> */}
      </div>
      <Breadcrumb>
        {aheadTitle.map((item, index) => {
          return (
            <Breadcrumb.Item
              style={{ color: 'black' }}
              key={item.title}
              onClick={() => item.path && history.push(item.path)}
            >
              {item.title}
            </Breadcrumb.Item>
          );
        })}

        <Breadcrumb.Item style={{ color: '#4079FF' }}>{currentTitle}</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};

export default Index;
