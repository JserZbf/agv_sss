import http from '../../http';

export const dictPage = (params) => {
    return http.post('/api/sss-agv-service/AgvModel/getAll', params);
};

export const dictUpdate = (params) => {
    return http.put('/api/sss-agv-service/AgvModel/update', params);
};