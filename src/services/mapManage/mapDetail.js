import http from '../http';

export const dictPage = (params) => {
    return http.get('/api/sss-agv-service/Map/getAll', params);
};

export const dictMapList = (params) => {
    return http.get(`/api/sss-agv-service/Map/exportMap/${params.mapId}`);
};

export const dictAdd = (params) => {
    return http.post('/api/sss-agv-service/Position/save', params);
};

export const dictUpdate = (params) => {
    return http.put('/api/sss-agv-service/Position/update', params);
};

export const dictDelete = (params) => {
    return http.delete('/api/sss-agv-service/Position/delete', params);
};

// 节点关系相关

export const dictRelationAdd = (params) => {
    return http.post('/api/sss-agv-service/Relation/save', params);
};

export const dictRelationUpdata = (params) => {
    return http.put('/api/sss-agv-service/Relation/updata', params);
};

export const dictRelationDelete = (params) => {
    return http.delete('/api/sss-agv-service/Relation/delete', params);
};
// 地图相关
export const dictgetMapData = (params) => {
    return http.post('/api/sss-agv-service/MapData/getMapData', params);
};

export const dictSetMapData = (params) => {
    return http.post('/api/sss-agv-service/MapData/setMapData', params);
};
export const dictAgvModel = (params) => {
    return http.post('/api/sss-agv-service/AgvModel/getAll',params);
};
