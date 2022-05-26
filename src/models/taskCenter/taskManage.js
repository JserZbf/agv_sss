
import {
    dictPage, dictAdd, dictDel, dictTaskStates, dictAgvModel, dictAgvPosition
} from 'services/taskCenter/taskManage';
import { notification } from 'antd'

const openNotificationWithIcon = (type, title, content) => {
    notification[type]({
        message: title,
        description: content,
    });
};

export default {
    namespace: 'taskManage',
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
        agvPositonList: []
    },
    effects: {
        *dictPage({ payload }, { call, put, select }) {
            try {
                const { params } = yield select((state) => state.taskManage);
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
        *dictTaskStates({ payload }, { call, put }) {
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
        },
        *dictAgvModel({ payload }, { call, put }) {
            try {
                const { code, data, message } = yield call(dictAgvModel, {current: 1, pageSize: 100});
                const agvModelList = data?.records.map(item => {
                    return {
                        key: item.id,
                        value: item.agvModelName
                    }
                })
                if (code === 200) {
                    yield put({
                        type: 'save',
                        payload: {
                            agvModelList: agvModelList || []
                        },
                    });
                } else {
                    openNotificationWithIcon('info', message);
                    yield put({
                        type: 'save',
                        payload: {
                            agvModelList: agvModelList || []
                        },
                    });
                }

            } catch (error) {
                yield put({
                    type: 'save',
                    payload: {
                        agvModelList: [],
                    },
                });
            }
        },
        *dictAgvPosition({ payload }, { call, put }) {
            try {
                const { code, data, message } = yield call(dictAgvPosition, {...payload});
                const agvPositonList = data?.records.map(item => {
                    return {
                        key: item.id,
                        value: item.agvModelName
                    }
                })
                if (code === 200) {
                    yield put({
                        type: 'save',
                        payload: {
                            agvPositonList: agvPositonList || []
                        },
                    });
                } else {
                    openNotificationWithIcon('info', message);
                    yield put({
                        type: 'save',
                        payload: {
                            agvPositonList: agvPositonList || []
                        },
                    });
                }

            } catch (error) {
                yield put({
                    type: 'save',
                    payload: {
                        agvPositonList: [],
                    },
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
