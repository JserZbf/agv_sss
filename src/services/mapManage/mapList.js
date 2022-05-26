import http from '../http';

export const dictPage = (params) => {
    return http.get('/api/sss-agv-service/Map/getAll', params);
};

export const dictAdd = (params) => {
    return http.post('/api/sss-agv-service/Map/save', params);
};
export const dictUpdate = (params) => {
    return http.put('/api/sss-agv-service/Map/update', params);
};

export const dictDel = (params) => {
    return http.delete('/api/sss-agv-service/Map/delete', params);
};

export const dictUpState = (params) => {
    return http.put('/api/sss-agv-service/Map/updateState', params);
};