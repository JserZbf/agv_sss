
import {
    dictAdd,
    dictUpdate,
    dictDelete,
    dictMapList,
    dictRelationUpdata,
    dictRelationDelete,
    dictRelationAdd,
    dictSetMapData,
    dictgetMapData
} from 'services/mapManage/mapDetail';
import { notification } from 'antd';

const openNotificationWithIcon = (type, title, content) => {
    notification[type]({
        message: title,
        description: content,
    });
};

export default {
    namespace: 'mapDetail',
    state: {
        checkout: true,
        visible: false,
        treeType: '',
        treeInfoFormVisible: false,
        isAdd: true,
        editId: "",
        ruleData: [],
        params: {
            current: 1,
            pageSize: 10
        },
        storeData: [],
        total: "",
        dictParentData: [],
        treeSelectInfo: {},
        drawData: {
            nodeList: [],
            edgesList: []
        },
        mapId: '',
        mapdata: '',
        treeData: [],
        textData: {}
    },
    effects: {

        *dictAdd({ payload }, { call, put, select }) {
            try {

                const { mapId } = yield select((state) => state.mapDetail);

                const { code, data, message } = yield call(dictAdd, payload);
                if (code === 200) {
                    openNotificationWithIcon('success', '创建成功');
                } else {
                    openNotificationWithIcon('info', message);
                }

                yield put({
                    type: 'save',
                    payload: {
                        treeInfoFormVisible: false,
                    },
                });
                yield put({ type: 'dictTreeData',payload: {
                    mapId,
                } });
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
        },
        *dictUpdate({ payload }, { call, put, select }) {
            
            try {

                const { mapId } = yield select((state) => state.mapDetail);

                const { code,  message } = yield call(dictUpdate, payload);

                if (code === 200) {
                    openNotificationWithIcon('success', '修改成功');
                } else {
                    openNotificationWithIcon('info', message);
                }
                yield put({
                    type: 'save',
                    payload: {
                        treeInfoFormVisible: false,
                    },
                });
                yield put({type: 'dictTreeData',payload: {
                    mapId,
                }});
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
        },
        *dictDelete({ payload }, { call, put, select }) {
            try {
                const { mapId } = yield select((state) => state.mapDetail);
                const { code, message } = yield call(dictDelete, payload);
                if (code === 200) {
                    openNotificationWithIcon('success', '删除成功');
                } else {
                    openNotificationWithIcon('info', message);
                };
                yield put({type: 'dictTreeData',payload: {
                    mapId,
                }});
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
        },
        *dictTreeData({ payload }, { call, put }) {
            try {

                const { code, data, message } = yield call(dictMapList, payload);

                const resultPositionDTOList = data.positionDTOList || []
                const resultRelationDTOList = data.relationDTOList || []
                const treeDataResultPositionDTOList = resultPositionDTOList.filter(item => {
                    return item.positionType !== 'NORMAL'
                }).map(item => {
                    const result = new Array(1,2,3).map((childitem, index) => {
                        const childNode = []
                        childNode.push({
                            hierarchy: 'action',
                            title: '起点动作',
                            key: item.operationsWhenStart.length ? item.operationsWhenStart.toString() : Math.random(),
                        })
                        childNode.push({
                            hierarchy: 'action',
                            title: '路径动作',
                            key: item.operationsWhenPass.length ? item.operationsWhenPass.toString() : Math.random()
                        })
                        childNode.push({
                            hierarchy: 'action',
                            title: '终点动作',
                            key: item.operationsWhenEnd.length ? item.operationsWhenEnd.toString() : Math.random(),
                        })
                        return {
                            ...childNode[index]
                        }
                    })
                    return {
                        title: item.positionName,
                        key: item.id,
                        hierarchy: 'site',
                        ...item,
                        children: result
                    }
                })

                const treeDataResultnodeDTOList = resultPositionDTOList.filter(item => {
                    return item.positionType === 'NORMAL'
                }).map(item => {
                    const result = new Array(1,2,3).map((childitem, index) => {
                        const childNode = []
                        childNode.push({
                            hierarchy: 'action',
                            title: '起点动作',
                            key: item.operationsWhenStart.length ? item.operationsWhenStart.toString() : Math.random(),
                        })
                        childNode.push({
                            hierarchy: 'action',
                            title: '路径动作',
                            key: item.operationsWhenPass.length ? item.operationsWhenPass.toString() : Math.random()
                        })
                        childNode.push({
                            hierarchy: 'action',
                            title: '终点动作',
                            key: item.operationsWhenEnd.length ? item.operationsWhenEnd.toString() : Math.random(),
                        })
                        return {
                            ...childNode[index]
                        }
                    })
                    return {
                        title: item.positionName,
                        key: item.id,
                        hierarchy: 'node',
                        ...item,
                        children: result
                    }
                })


                const siteRelationDTOList = [{
                    title: '站点',
                    key: 'site',
                    hierarchy: 'default',
                    canAdd: true,
                    children: treeDataResultPositionDTOList
                }]
                const nodeRelationDTOList = [{
                    title: '节点',
                    key: 'node',
                    hierarchy: 'default',
                    canAdd: true,
                    children: treeDataResultnodeDTOList
                }]

                const TreeRelationDTOList = [{
                    title: '路线',
                    key: 'luxian',
                    hierarchy: 'default',
                    children: resultRelationDTOList.map(item => {
                        return {
                            hierarchy: 'path',
                            title: item.relationName,
                            key: item.id,
                            ...item
                        }
                    })
                }]
                
                const resultTreeData = [{
                    title: data.mapName,
                    key: payload.mapId,
                    hierarchy: 'default',
                    children: [
                        ...siteRelationDTOList,
                        ...nodeRelationDTOList,
                        ...TreeRelationDTOList
                    ]
                }]

                if (code === 200) {
                    yield put({
                        type: 'save',
                        payload: {
                            textData: data,
                            treeData: resultTreeData || [],
                            drawData: {
                                nodeList: resultPositionDTOList,
                                edgesList: resultRelationDTOList 
                            },
                            mapId: payload.mapId
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
        
        *dictRelationUpdata({ payload }, { call, put, select }) {
            
            try {

                const { mapId } = yield select((state) => state.mapDetail);

                const { code,  message } = yield call(dictRelationUpdata, payload);

                if (code === 200) {
                    openNotificationWithIcon('success', '修改成功');
                } else {
                    openNotificationWithIcon('info', message);
                }
                yield put({
                    type: 'save',
                    payload: {
                        treeInfoFormVisible: false,
                    },
                });
                yield put({type: 'dictTreeData',payload: {
                    mapId,
                }});
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
        },
        *dictRelationDelete({ payload }, { call, put, select }) {
            
            try {

                const { mapId } = yield select((state) => state.mapDetail);

                const { code,  message } = yield call(dictRelationDelete, payload);

                if (code === 200) {
                    openNotificationWithIcon('success', '删除成功');
                } else {
                    openNotificationWithIcon('info', message);
                }
                yield put({
                    type: 'save',
                    payload: {
                        treeInfoFormVisible: false,
                    },
                });
                yield put({type: 'dictTreeData',payload: {
                    mapId,
                }});
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
        },
        *dictRelationAdd({ payload }, { call, put, select }) {
            
            try {

                const { mapId } = yield select((state) => state.mapDetail);

                const { code,  message } = yield call(dictRelationAdd, payload);

                if (code === 200) {
                    openNotificationWithIcon('success', '添加成功');
                } else {
                    openNotificationWithIcon('info', message);
                }
                yield put({
                    type: 'save',
                    payload: {
                        treeInfoFormVisible: false,
                    },
                });
                yield put({type: 'dictTreeData',payload: {
                    mapId,
                }});
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
        },
        *dictSetMapData({ payload }, { call, put }) {          
            try {

                const { code,  message } = yield call(dictSetMapData, payload);

                if (code === 200) {
                    openNotificationWithIcon('success', '保存成功');
                } else {
                    openNotificationWithIcon('info', message);
                }
            } catch (error) {
                yield put({
                    type: 'save',
                });
            }
        },
        *dictgetMapData({ payload }, { call, put }) {  
            try {

                const { data } = yield call(dictgetMapData, payload);
                yield put({
                    type: 'save',
                    payload: {
                        mapdata: data || '',
                    },
                });

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
