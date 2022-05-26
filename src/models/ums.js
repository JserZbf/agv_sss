import { login, logout, getAuthorityMenu } from 'services/umsApi';
import { notification } from 'antd';
import history from 'common/history';
import { changeMenuTree } from 'common/tools';

import pathConfig from '../config/pathConfig';

const navTo = history.push;
const openNotificationWithIcon = (type, title, content) => {
  notification[type]({
    message: title,
    description: content,
  });
};
export default {
  namespace: 'ums',
  state: {
    userInfo: {},
    personal: {},
    authorityMenu: [],
  },
  subscriptions: {},
  effects: {
    *userLogin({ payload }, { call, put }) {
      try {
        const { code, data, message } = yield call(login, payload);

        if (code === 200) {
          localStorage.setItem('Authorization', data.accessToken);
          localStorage.setItem('userInfo', JSON.stringify(data));
          yield put({
            type: 'getAuthorityMenu',
          });
          navTo(pathConfig.vehicle.path);
        } else {
          openNotificationWithIcon('warn', message);
        }
        yield put({
          type: 'save',
          payload: {
            userInfo: data,
          },
        });
      } catch (error) {
        openNotificationWithIcon('error', '登陆失败');
        yield put({
          type: 'save',
          payload: {
            userInfo: [],
          },
        });
      }
    },
    *ssoLogout({ payload }, { call, put }) {
      try {
        const { code, data, message } = yield call(logout, payload);
        if (Number(code) === 200) {
          navTo(pathConfig.login.path);
        } else {
          openNotificationWithIcon('error', message);
        }
      } catch (error) {}
    },

    *getAuthorityMenu({ payload }, { call, put }) {
      try {
        const { code, data } = yield call(getAuthorityMenu, payload);
        if (code === 200) {
          yield put({
            type: 'save',
            payload: {
              personal: data,
              authorityMenu: changeMenuTree(data?.permissionTree) || [],
            },
          });
        }
      } catch (error) {}
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
