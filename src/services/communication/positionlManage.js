import http from '../http';

export const dictPage = (params) => {
    return http.post('/api/sss-agv-service/Interact/getAll', params);
};

export const dictAdd = (params) => {
    return http.post('/api/sss-agv-service/Interact/save', params);
};

export const dictUpdate = (params) => {
    return http.put('/api/sss-agv-service/Interact/update', params);
};


export const dictDel = (params) => {
    return http.delete('/api/sss-agv-service/Interact/delete', params);
};

export const dictTaskStates = () => {
    return http.get('/api/sss-agv-service/Task/taskStateEnumMap');
};