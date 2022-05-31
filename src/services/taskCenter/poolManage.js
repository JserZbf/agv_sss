import http from '../http';

export const dictPage = (params) => {
    return http.get('/api/sss-agv-service/RunTimeTask/getAll', params);
};
export const dictDel = (params) => {
    return http.delete('/api/sss-agv-service/Task/delete', params);
};
export const dicPause = (params) => {
    return http.post('/api/sss-agv-service/Task/pauseTask', params);
};

export const dictUpdate = (params) => {
    return http.put('/api/sss-agv-service/Task/update', params);
};

export const dictTaskStates = () => {
    return http.get('/api/sss-agv-service/Task/taskStateEnumMap');
};

export const dictAgvModel = (params) => {
    return http.post('/api/sss-agv-service/AgvModel/getAll',params);
};

export const dictMapList = (params) => {
    return http.get('/api/sss-agv-service/Map/getAll', params);
};

export const dictTaskType = (params) => {
    return http.get('/api/sss-agv-service/Task/taskTypeEnumMap',params);
};