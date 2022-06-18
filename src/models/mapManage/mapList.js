
import {
    dictPage, dictAdd, dictUpdate, dictDel, dictUpState, dictImport
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
        visible: false,
        isAdd: true,
        ruleData: [],
        params: {
            current: 1,
            pageSize: 10
        },
        storeData: [],
        total: ""
    },
    effects: {

        *dictPage({}, { call, put, select }) {
            try {
                const { params } = yield select((state) => state.mapList);

                const { code, data, message } = yield call(dictPage, { ...params });
                if (code === 200) {
                    yield put({
                        type: 'save',
                        payload: {
                            ruleData: data.records || [],
                            total: data.total
                        },
                    });
                } else {
                    openNotificationWithIcon('info', message);
                    yield put({
                        type: 'save',
                        payload: {
                            ruleData: []
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
                const { code, message } = yield call(dictAdd, payload);
                if (code === 200) {
                    openNotificationWithIcon('success', '创建成功');
                    yield put({
                        type: 'save',
                        payload: {
                            visible: false,
                        },
                    });
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
        *dictUpdate({ payload }, { call, put }) {
            try {
                const { code, message } = yield call(dictUpdate, payload);

                if (code === 200) {
                    openNotificationWithIcon('success', '修改成功');
                    yield put({
                        type: 'save',
                        payload: {
                            visible: false,
                        },
                    });
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
        *dictDel({ payload }, { call, put }) {
            try {
                const { code, message } = yield call(dictDel, payload);
                if (code === 200) {
                    openNotificationWithIcon('success', '删除成功');
                } else {
                    openNotificationWithIcon('info', message);
                };
                
                yield put({ type: 'dictPage' });
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
        },
        *dictUpState({ payload }, { call, put }) {
            try {
                const { code, message } = yield call(dictUpState, payload);

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
        *dictImport({ payload }, { call, put }) {
            try {

                const { code, message } = yield call(dictImport, payload);

                if (code === 200) {
                    openNotificationWithIcon('success', '上传成功');
                } else {
                    openNotificationWithIcon('info', message);
                }
                yield put({type: 'dictPage'});
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
        }
        
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
