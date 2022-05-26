import pathConfig from 'config/pathConfig';

const SideMenuConfig = [
  // 车辆中心
  {
    name: pathConfig.vehicle.name,
    path: pathConfig.vehicle.path,
    id: pathConfig.vehicle.path,
    icon: pathConfig.vehicle.icon,
    children: [
      {
        name: pathConfig.moduleList.name,
        path: pathConfig.moduleList.path,
        id: pathConfig.moduleList.path,
      },
      {
        name: pathConfig.vehicleList.name,
        path: pathConfig.vehicleList.path,
        id: pathConfig.vehicleList.path,
      },
    ],
  },
  // 地图管理
  {
    name: pathConfig.mapManage.name,
    path: pathConfig.mapManage.path,
    id: pathConfig.mapManage.path,
    icon: pathConfig.mapManage.icon,
    children: [
      {
        name: pathConfig.mapList.name,
        path: pathConfig.mapList.path,
        id: pathConfig.mapList.path,
      },
    ],
  },
  // 任务中心
  {
    name: pathConfig.taskCenter.name,
    path: pathConfig.taskCenter.path,
    id: pathConfig.taskCenter.path,
    icon: pathConfig.taskCenter.icon,
    children: [
      {
        name: pathConfig.taskManage.name,
        path: pathConfig.taskManage.path,
        id: pathConfig.taskManage.path,
      },
    ],
  },
];

export default SideMenuConfig;
