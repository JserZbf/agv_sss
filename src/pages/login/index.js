import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Checkbox,Popconfirm } from 'antd';
import CryptoJS from 'crypto-js'
import xichaiLogo from '../../assets/xichai_logo.png'
import floor from '../../assets/floor.png'
import styles from './index.less'

const Login = function ({ userInfo, userLogin }) {

  const onFinish = (values) => {
    localStorage.removeItem('Authorization');
    const valueTrim = {};
    for (const [key, value] of Object.entries(values)) {
      valueTrim[key] = value
    }
  
    const data = {
      ...valueTrim,
      code: 'sss',
      password: CryptoJS.MD5(valueTrim.password).toString(),
    };
    const formData = new FormData();
    for (const item of Object.keys(data)) {
      formData.append(item, data[item]);
    }
    console.log(formData)
    userLogin(formData );
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerLeft}>
        <div className={styles.boxCenter}>
          <div className={styles.fawdeLogo}>
            <img alt='' src={xichaiLogo} />
          </div>
          <div className={styles.loginForm}>
            <p className={styles.title}>AGV调度系统</p>
            <Form
              name="basic"
              style={{ width: "100%" }}

              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item

                name="username"
                rules={[
                  {
                    required: true,
                    message: '用户名',
                  },
                ]}
              >
                <Input placeholder='用户名' />
              </Form.Item>

              <Form.Item

                name="password"
                rules={[
                  {
                    required: true,
                    message: '密码',
                  },
                ]}
              >
                <Input.Password placeholder='密码' />
              </Form.Item>

              {/* <Form.Item
                name="remember"
                valuePropName="记住登录信息"

              >
                <Checkbox><span className={styles.rememberSize}>记住登录信息</span></Checkbox>
              </Form.Item> */}

              <Form.Item

              >
                <Button type="primary" htmlType="submit" className={styles.buttonStyle}>
                  登录
                </Button>
              </Form.Item>
            </Form>
            {/* <p className={styles.register}>忘记密码 ? &nbsp;  |  &nbsp;  注册</p> */}
          </div>
        </div>
      </div>
      <div className={styles.containerRight}>
        <img src={floor} alt='' />
      </div>
    </div>
  );
};

export default connect(
  ({ ums }) => ({
    userInfo: ums.userInfo,
  }),
  (dispatch) => ({
    userLogin: (payload) => dispatch({ type: 'ums/userLogin', payload }),
  }),
)(Login);
