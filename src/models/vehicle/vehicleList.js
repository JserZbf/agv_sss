
import {
    dictPage,
    dictAdd,
    dictDel,
    dictState,
    dictAgvModel,
    dicPositionList,
    dictMapList,
    dicMount,
    dictUpdate,
    resetAgv,
    dicUnmount
} from 'services/vehicle/vehicleList';
import { notification } from 'antd'

const openNotificationWithIcon = (type, title, content) => {
    notification[type]({
        message: title,
        description: content,
    });
};

let time

export default {
    namespace: 'vehicleList',
    state: {
        visible: false,     //新增弹窗展示隐藏
        mountVisible: false,   // 挂载弹窗
        parameVisible: false, // 配置弹窗
        ruleData: [],   // table列表
        isAdd: false, // 是否新增
        params: {
            current: 1,
            pageSize: 10
        },
        stateList: [],  //状态下拉列表
        agvModelList: [],   // 车辆类型下拉列表
        agvPositonList: [], //所在节点下拉列表
        agvInfo: {} //编辑信息
    },
    effects: {
        *dictPage({}, { call, put, select }) {
            try {
               if (time) {
                clearTimeout(time)
               }
                const { params } = yield select((state) => state.vehicleList);
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
        *dicMount({ payload }, { call, put }) {
            try {
                const { code, message } = yield call(dicMount, payload);
                if (code === 200) {
                    openNotificationWithIcon('success', '挂载成功');
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
        *dicUnmount({ payload }, { call, put }) {
            try {
                const { code, message } = yield call(dicUnmount, payload);
                if (code === 200) {
                    openNotificationWithIcon('success', '退出成功');
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
                const { code, message } = yield call(dictUpdate, payload);
                if (code === 200) {
                    openNotificationWithIcon('success', '配置成功');
                } else {
                    openNotificationWithIcon('info', message);
                }

                yield put({
                    type: 'save',
                    payload: {
                        parameVisible: false,
                    },
                });
                yield put({ type: 'dictPage' });
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
        },
        *resetAgv({ payload }, { call, put }) {
            try {
                const { code, message } = yield call(resetAgv, payload);
                if (code === 200) {
                    openNotificationWithIcon('success', '复位成功');
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
        *dictStopTime({}, {}) {
            try {
                if (time) {
                    clearTimeout(time)
                }
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
