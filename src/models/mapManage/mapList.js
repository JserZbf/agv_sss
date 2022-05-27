
import {
    dictPage, dictAdd, dictUpdate, dictDel, dictUpState
} from 'services/mapManage/mapList';
import { notification } from 'antd'

const openNotificationWithIcon = (type, title, content) => {
    notification[type]({
        message: title,
        description: content,
    });
};

export default {
    namespace: 'mapList',
    state: {
        checkout: true,
        visible: false,
        isAdd: true,
        editId: "",
        ruleData: [],
        params: {
            current: 1,
            pageSize: 10
        },
        storeData: [],
        total: "",
        dictParentData: []
    },
    effects: {

        *dictPage({ payload }, { call, put, select }) {
            try {
                const { params } = yield select((state) => state.vehicleModuleList);
                const { code, data, message } = yield call(dictPage, {  });
                if (code === 200) {
                    yield put({
                        type: 'save',
                        payload: {
                            ruleData: data|| [],
                            total: 1,
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
        *dictUpdate({ payload }, { call, put }) {
            try {
                const { code, data, message } = yield call(dictUpdate, payload);

                if (code === 200) {
                    openNotificationWithIcon('success', '修改成功');
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
        *dictUpState({ payload }, { call, put }) {
            try {
                const { code, data, message } = yield call(dictUpState, payload);

                if (code === 200) {
                    openNotificationWithIcon('success', '修改成功');
                } else {
                    openNotificationWithIcon('info', message);
                }
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