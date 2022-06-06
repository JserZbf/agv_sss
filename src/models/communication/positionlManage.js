
import {
    dictPage, dictAdd, dictUpdate, dictDel, dictTaskStates, dictAgvModel, dictMapList, dicPositionList, dictIssue, dictTaskType
} from 'services/communication/positionlManage';
import { notification } from 'antd'

const openNotificationWithIcon = (type, title, content) => {
    notification[type]({
        message: title,
        description: content,
    });
};

export default {
    namespace: 'positionlManage',
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
        taskStates: [],
        agvModelList: [],
        agvPositonList: [],
        taskTypeList: []
    },
    effects: {
        *dictPage({}, { call, put, select }) {
            try {
                const { params } = yield select((state) => state.positionlManage);
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
        *dictAdd({ payload }, { call, put }) {
            try {
                const { code, message } = yield call(dictAdd, payload);
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
                const { code, message } = yield call(dictUpdate, {...payload});
                if (code === 200) {
                    openNotificationWithIcon('success', '修改成功');
                } else {
                    openNotificationWithIcon('info', message);
                };

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
                const { code, message } = yield call(dictDel, payload);
                if (code === 200) {
                    openNotificationWithIcon('success', '删除成功');
                } else {
                    openNotificationWithIcon('info', message);
                };

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
        *dictTaskStates({}, { call, put }) {
            try {
                const { code, data, message } = yield call(dictTaskStates);
                const taskSraresList = Object.keys(data).map(item => {
                    return {
                        key: data[item],
                        value: item
                    }
                })
                if (code === 200) {
                    yield put({
                        type: 'save',
                        payload: {
                            taskStates: taskSraresList || []
                        },
                    });
                } else {
                    openNotificationWithIcon('info', message);
                    yield put({
                        type: 'save',
                        payload: {
                            taskStates: []
                        },
                    });
                }

            } catch (error) {
                yield put({
                    type: 'save',
                    payload: {
                        taskStates: [],
                    },
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
