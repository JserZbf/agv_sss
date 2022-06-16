
import {
    dictPage,
    dictAdd,
    dictUpdate,
    dictDel,
    dictTaskStates,
    dictAgvModel,
    dictMapList,
    dicPositionList,
    dictIssue,
    dictTaskType,
    dictCompare
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
        visible: false,
        isAdd: true,
        ruleData: [],
        params: {
            current: 1,
            pageSize: 10,
            taskState: 'CREATED'
        },
        storeData: [],
        total: "",
        taskStates: [],
        agvModelList: [],
        agvPositonList: [],
        taskTypeList: [],
        priorityList: []
    },
    effects: {
        *dictPage({}, { call, put, select }) {
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
        },
        *dictAgvModel({}, { call, put }) {
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
        *dictMapList({}, { call, put }) {
            try {
                const { code, data, message } = yield call(dictMapList, {current: 1, pageSize: 999});
                if (code === 200) {      
                    const findUsedMapInfo = data.filter(item=> item.used)
                    if (findUsedMapInfo.length) {
                        yield put({type: 'dicPositionList',payload: {
                            mapId: findUsedMapInfo[0].id,
                        }});
                    } else {
                        yield put({
                            type: 'save',
                            payload: {
                                agvPositonList:[]
                            },
                        });
                    }
                    
                } else {
                    openNotificationWithIcon('info', message);
                }

            } catch (error) {}
        },
        *dicPositionList({ payload }, { call, put }) {
            try {
                const { code, data, message } = yield call(dicPositionList, {...payload});

                const agvPositonList = data.map(item => {
                    return {
                        key: item.id,
                        value: item.positionName
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
        *dictIssue({ payload }, { call, put }) {
            try {
                const { code, message } = yield call(dictIssue, {...payload});
                if (code === 200) {
                    openNotificationWithIcon('success', '下发成功');
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
        *dictTaskType({}, { call, put }) {
            try {
                const { code, data, message } = yield call(dictTaskType);
                const taskTypeList = Object.keys(data).map(item => {
                    return {
                        key: data[item],
                        value: item
                    }
                })
                if (code === 200) {
                    yield put({
                        type: 'save',
                        payload: {
                            taskTypeList: taskTypeList || []
                        },
                    });
                } else {
                    openNotificationWithIcon('info', message);
                    yield put({
                        type: 'save',
                        payload: {
                            taskTypeList: []
                        },
                    });
                }

            } catch (error) {}
        },
        *dictCompare({}, { call, put }) {
            try {
                const { code, data, message } = yield call(dictCompare);
                const priorityList = Object.keys(data).map(item => {
                    return {
                        key: data[item],
                        value: item
                    }
                })
                if (code === 200) {
                    yield put({
                        type: 'save',
                        payload: {
                            priorityList: priorityList || []
                        },
                    });
                } else {
                    openNotificationWithIcon('info', message);
                    yield put({
                        type: 'save',
                        payload: {
                            taskTypeList: []
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
