
import {
    dictPage, dictDel, dictTaskStates, dictAgvModel, dictMapList, dictTaskType
} from 'services/taskCenter/poolManage';
import { notification } from 'antd'

const openNotificationWithIcon = (type, title, content) => {
    notification[type]({
        message: title,
        description: content,
    });
};
let time

export default {
    namespace: 'poolManage',
    state: {
        visible: false,
        ruleData: [],
        params: {
            current: 1,
            pageSize: 10
        },
        taskStates: [],
        agvModelList: [],
        taskTypeList: [],
        stateList: [],  //状态下拉列表
    },
    effects: {
        *dictPage({}, { call, put, select }) {
            try {
               if (time) {
                clearTimeout(time)
               }
                const { params } = yield select((state) => state.poolManage);
                const { code, data, message } = yield call(dictPage, { ...params });
                if (code === 200) {
                    yield put({
                        type: 'save',
                        payload: {
                            ruleData: data.records || [],
                        },
                    });
                } else {
                    openNotificationWithIcon('info', message);
                    yield put({
                        type: 'save',
                        payload: {
                            ruleData: [],
                        },
                    });
                }
                
                yield new Promise((resolve) => time = setTimeout(resolve, 2000));
                yield put({ type: 'dictPage' });

            } catch (error) {
                yield put({
                    type: 'save',
                    payload: {
                        ruleData: [],
                    },
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
                });
                yield put({ type: 'dictPage' });
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
        },
        *dicPause({ payload }, { call, put }) {
            try {
                const { code, message } = yield call(dicPause, payload);
                if (code === 200) {
                    openNotificationWithIcon('success', '已暂停任务');
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
                    }
                    
                } else {
                    openNotificationWithIcon('info', message);
                }

            } catch (error) {}
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
        *dictState({}, { call, put, select }) {
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
