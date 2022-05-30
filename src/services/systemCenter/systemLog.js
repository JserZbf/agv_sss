import http from '../http';

export const dictPage = (params) => {
    return http.post('/api/sss-agv-service/AgvRecord/getAll', params);
};
export const dictTaskStates = () => {
    return http.get('/api/sss-agv-service/AgvRecord/getRecordTypeEnum');
};