
import {
    dictPage, dictUpdate
} from 'services/vehicle/moduledetail/attribute';
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
        visible: false,
        ruleData: [],
        params: {
            current: 1,
            pageSize: 999
        },
        storeData: [],
        total: "",
        agvId: ''
    },
    effects: {

        *dictPage({}, { call, put, select }) {
            try {
                const { params, agvId } = yield select((state) => state.vehicleAttribute);
                const { code, data, message } = yield call(dictPage, { ...params });
                const ruleData = data.records.filter(item=> {
                    return item.id === agvId
                })
                if (code === 200) {
                    yield put({
                        type: 'save',
                        payload: {
                            ruleData: ruleData || [],
                            total: data.total,
                            agvId:agvId
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
        *dictUpdate({ payload }, { call, put, select }) {
            try {
                const { code, message } = yield call(dictUpdate, payload);

                const { agvId } = yield select((state) => state.vehicleModuleList);

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
                yield put({ type: 'dictPage',payload: {
                    agvId,
                } });
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
