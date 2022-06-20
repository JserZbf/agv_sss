import http from '../http';

export const dictPage = (params, cycleParams) => {
    return http.post('/api/sss-agv-service/Agv/getAll', params, {}, {} , cycleParams.isCycle);
};

// 操作 start
export const dictAdd = (params) => {
    return http.post('/api/sss-agv-service/Agv/save', params);
};

export const dictUpdate = (params) => {
    return http.put('/api/sss-agv-service/Agv/update', params);
};
export const dicMount = (params) => {
    return http.post('/api/sss-agv-service/Agv/mount', params);
};
export const dicUnmount = (params) => {
    return http.put('/api/sss-agv-service/Agv/unmount', params);
};
export const resetAgv = (params) => {
    return http.put('/api/sss-agv-service/Agv/resetAgv', params);
};
export const dictDel = (params) => {
    return http.delete('/api/sss-agv-service/Agv/delete', params);
};
// 操作 end


export const dictState = (params) => {
    return http.get('/api/sss-agv-service/Agv/agvStateEnumMap', params);
};

export const dictAgvModel = (params) => {
    return http.post('/api/sss-agv-service/AgvModel/getAll',params);
};

export const dictMapList = (params) => {
    return http.get('/api/sss-agv-service/Map/getAll', params);
};

export const dicPositionList = (params) => {
    return http.get(`/api/sss-agv-service/Position/getAllByMap/${params.mapId}`);
};

