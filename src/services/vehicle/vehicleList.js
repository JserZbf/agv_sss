import http from '../http';

export const dictPage = (params) => {
    return http.post('/api/sss-agv-service/Agv/getAll', params);
};

export const dictState = (params) => {
    return http.get('/api/sss-agv-service/Agv/agvStateEnumMap', params);
};

export const dictAdd = (params) => {
    return http.post('/api/sss-agv-service/AgvModel/save', params);
};

export const dictDel = (params) => {
    return http.delete('/api/sss-agv-service/AgvModel/delete', params);
};