export default {
  login: {
    name: '登陆',
    path: '/login',
  },
  //车辆中心
  vehicle: {
    name: '车辆中心',
    path: '/vehicle',
    icon: 'icon-cheliang',
  },

  moduleList: {
    name: '模块管理',
    path: '/vehicle/moduleList',
    icon: 'icon-bank-fill',
  },
  detailAttribute: {
    name: '模块详情-属性',
    path: '/vehicle/moduledetail/attribute',
    icon: 'icon-bank-fill',
  },
  vehicleList: {
    name: '车辆管理',
    path: '/vehicle/vehicleList',
    icon: 'icon-bank-fill',
  },
  //地图管理
  mapManage: {
    name: '地图管理',
    path: '/mapManage',
    icon: 'icon-ditu',
  },

  mapList: {
    name: '地图列表',
    path: '/mapManage/mapList',
    icon: 'icon-ditu',
  },
  mapDetail: {
    name: '地图列表',
    path: '/mapManage/mapDetail/:mapId',
    icon: 'icon-ditu',
  },
   //任务中心
   taskCenter: {
    name: '任务中心',
    path: '/taskCenter',
    icon: 'icon-renwuzhongxin',
  },

  taskManage: {
    name: '任务管理',
    path: '/taskCenter/taskManage',
    icon: 'icon-renwuzhongxin',
  },
  poolManage: {
    name: '任务池',
    path: '/taskCenter/poolManage',
  },
  communication: {
    name: '互联通信',
    path: '/communication',
    icon: 'icon-tongxunlu',
  },
  positionlManage: {
    name: '交互点位配置',
    path: '/communication/positionlManage',
  },
  systemCenter: {
    name: '系统中心',
    path: '/systemCenter',
    icon: 'icon-xitong',
  },
  systemLog: {
    name: '系统日志',
    path: '/systemCenter/systemLog'
  },
  default: {
    path: '/vehicle/moduleList',
  },
};
