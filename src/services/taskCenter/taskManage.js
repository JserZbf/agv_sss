import http from '../http';

export const dictPage = (params) => {
    return http.post('/api/sss-agv-service/Task/getAll', params);
};

export const dictAdd = (params) => {
    return http.post('/api/sss-agv-service/Task/save', params);
};

export const dictDel = (params) => {
    return http.delete('/api/sss-agv-service/Task/delete', params);
};

export const dictTaskStates = () => {
    return http.get('/api/sss-agv-service/Task/taskStateEnumMap');
};
// export const dictAgvModel = () => {
//     return http.get('/api/sss-agv-service/AgvModel/getAllByMap');
// };

export const dictAgvModel = (params) => {
    return http.post('/api/sss-agv-service/AgvModel/getAll',params);
};

export const dictAgvPosition = (params) => {
    return http.get(`/api/sss-agv-service/Position/getAllByMap`);
};