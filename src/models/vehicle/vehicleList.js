
import {
    dictPage, dictAdd, dictDel, dictState
} from 'services/vehicle/vehicleList';
import { notification } from 'antd'

const openNotificationWithIcon = (type, title, content) => {
    notification[type]({
        message: title,
        description: content,
    });
};

export default {
    namespace: 'vehicleList',
    state: {
        checkout: true,
        visible: false,
        mountVisible: false,
        parameVisible: false,
        isAdd: true,
        editId: "",
        ruleData: [],
        params: {
            current: 1,
            pageSize: 200
        },
        storeData: [],
        total: "",
        dictParentData: [],
        stateList: []
    },
    effects: {
        *dictPage({ payload }, { call, put, select }) {
            try {
                const { params } = yield select((state) => state.vehicleList);
                const { code, data, message } = yield call(dictPage, { ...params });
                if (code === 200) {
                    yield put({
                        type: 'save',
                        payload: {
                            ruleData: data.records || [],
                            total: data.total,
                        },
                    });
                } else {
                    openNotificationWithIcon('info', message);
                    yield put({
                        type: 'save',
                        payload: {
                            ruleData: [],
                            total: 0,
                        },
                    });
                }

            } catch (error) {
                yield put({
                    type: 'save',
                    payload: {
                        ruleData: [],
                    },
                });
            }
        },
        *dictState({ payload }, { call, put, select }) {
            try {
                const { params } = yield select((state) => state.vehicleList);
                const { code, data, message } = yield call(dictState, { ...params });
                if (code === 200) {
                    const stateList = Object.keys(data).map(item => {
                        return {
                            key: data[item],
                            value: item
                        }
                    })
                    yield put({
                        type: 'save',
                        payload: {
                            stateList: stateList || []
                        },
                    });
                } else {
                    openNotificationWithIcon('info', message);
                    yield put({
                        type: 'save',
                        payload: {
                            stateList: []
                        },
                    });
                }

            } catch (error) {
                yield put({
                    type: 'save',
                    payload: {
                        stateList: [],
                    },
                });
            }
        },
        *dictAdd({ payload }, { call, put }) {
            try {
                const { code, data, message } = yield call(dictAdd, payload);
                if (code === 200) {
                    openNotificationWithIcon('success', '创建成功');
                } else {
                    openNotificationWithIcon('info', message);
                }

                yield put({
                    type: 'save',
                    payload: {
                        visible: false,
                    },
                });
                yield put({ type: 'dictPage' });
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
        },
        *dictDel({ payload }, { call, put }) {
            try {
                const { code, data, message } = yield call(dictDel, payload);
                if (code === 200) {
                    openNotificationWithIcon('success', '删除成功');
                } else {
                    openNotificationWithIcon('info', message);
                };

                yield put({
                    type: 'save',
                });
                yield put({ type: 'dictPage' });
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
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
