
import {
    dictPage, dictAdd, dictUpdate, dictDel, dictParent
} from 'services/vehicle/moduleList';
import { notification } from 'antd'

const openNotificationWithIcon = (type, title, content) => {
    notification[type]({
        message: title,
        description: content,
    });
};

export default {
    namespace: 'vehicleAttribute',
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
        *dictParent({ payload }, { call, put, select }) {
            try {
                const { code, data, message } = yield call(dictParent, payload);
                if (code === 200) {
                    yield put({
                        type: 'save',
                        payload: {
                            dictParentData: data || [],
                        },
                    });
                } else {
                    openNotificationWithIcon('info', message);
                    yield put({
                        type: 'save',
                        payload: {
                            dictParentData: [],
                        },
                    });
                }

            } catch (error) { }
        },

        *dictPage({ payload }, { call, put, select }) {
            try {
                const { params } = yield select((state) => state.vehicleModuleList);
                // const { code, data, message } = yield call(dictPage, { ...params });
                const code = 200
                const data = {
                    records: [{
                        agvModelName: "模型名称",
                        agvPrecision: 0.001,
                        createTime:"2022-4-1",
                        creatorId: "麻花",
                        deleted: false,
                        id: 1,
                        imageId: "",
                        updateTime: "2022-4-1",
                        supplierName: "供应商名称",
                        updaterId: "我是修改热"
                    }],
                    total: 100
                }
                const message = "sccess"
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
