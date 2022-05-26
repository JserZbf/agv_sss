import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Graph, Shape } from '@antv/x6';
import '@antv/x6-react-shape';
import { notification } from 'antd';
import {
  EnvironmentOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { useSelector } from 'dva';

const DrawBox = ({  backImgUrl,mapId, dictRelationDelete, dictRelationAdd,saveModelsState,saveMapData, dictDelete,  dictSetMapData },ref) => {
  let selectLine = ''
  let selectNode = ''

  const { mapdata, drawData } = useSelector(
    (models) => models.mapDetail,
  );

  const ports = {
    groups: {
      group1: {
        position: "top",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#6290fa',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      group2: {
        position: "right",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#6290fa',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      group3: {
        position: "bottom",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#6290fa',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      group4: {
        position: "left",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#6290fa',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      }
    },
    items: [
      {
        id: 'port1',
        group: 'group1',
      },
      {
        id: 'port2',
        group: 'group2',
      },
      {
        id: 'port3',
        group: 'group3',
      },
      {
        id: 'port4',
        group: 'group4',
      },
    ]
  }

  const [newGraph, setGraph] = useState();

  useImperativeHandle(ref, () => ({
    saveDrawList,
    getDrawList: ()=> {
      return newGraph.toJSON()
    }
  }))

  useEffect(()=> {
    const graph = new Graph({
      container: document.getElementById('drawBox'),
      autoResize: true,
      grid: false,
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3,
      },
      translating: {
        restrict: true,
      },
      connecting: {
        router: {
          name: 'manhattan',
          args: {
            padding: 1,
          },
        },
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        allowNode: false,
        allowLoop: false,
        anchor: 'center',
        connectionPoint: 'boundary',
        allowBlank: false,
        allowPort: true,
        snap: {
          radius: 20,
        },
        EdgeAnchor: 'closest',
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#6290fa',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            zIndex: 0,
          })
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#5F95FF',
              stroke: '#5F95FF',
            },
          },
        },
      },
      resizing: false,
      rotating: false,
      selecting: {
        enabled: true,
        rubberband: true,
        showNodeSelectionBox: true,
        movable: false,
        multiple: false,
      },
      interacting: (cellView) => {
        const connectedEdges = graph.getConnectedEdges(cellView.cell)
        // 没有边才可以移动
        return {
          nodeMovable: !connectedEdges.length
        }
      },
      snapline: false,
      keyboard: true,
      clipboard: true,
    })

  // 控制连接桩显示/隐藏
  const showPorts = (ports, show) => {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
  graph.on('node:mouseenter', () => {
    const container = document.getElementById('drawBox')
    const ports = container.querySelectorAll(
      '.x6-port-body',
    )
    showPorts(ports, true)
  })
  graph.on('node:mouseleave', () => {
    const container = document.getElementById('drawBox')
    const ports = container.querySelectorAll(
      '.x6-port-body',
    )
    showPorts(ports, false)
  })
  graph.on('edge:connected',({ isNew, edge, currentCell }) => {
    if (isNew) {
      saveMapData()
      const source = edge.getSourceCell();
      dictRelationAdd({
        direction: 90,
        roadType: 'CURVE',
        startPositionId: source?.store?.data?.params?.id,
        endPositionId: currentCell.store?.data?.params?.id,
        relationName: `${source?.store?.data?.params?.name}到${currentCell.store?.data?.params?.name}`
      })
      
    }    
  })
  // #endregion
  setGraph(graph)
  },[])

  useEffect(() => {
    if (newGraph) {
      newGraph.on('edge:selected', (selectParams) => {
        selectNode = null
        selectLine = selectParams
        selectParams.cell.setAttrs({
          line: {
            stroke: 'red',
            strokeWidth: 3
          }
        })
      })
      newGraph.on('node:selected', (selectParams) => {     
        selectLine = null
        selectNode = selectParams
        newGraph.toggleSelectionMovable(false)
      })
      
      newGraph.bindKey(['Delete', 'Backspace'], (e) => {
        if (selectLine) {
          selectLine.cell.remove()
          saveMapData()
          const deleteID = selectLine.edge?.store?.data?.params?.edgesId
          deleteID && dictRelationDelete({id: deleteID})

          // confirm({
          //   title: '提示',
          //   icon: <ExclamationCircleOutlined />,
          //   content: '确认删除连线吗?',
          //   okText: '确认',
          //   okType: 'danger',
          //   cancelText: '取消',
          //   onOk() {
          //     selectLine.cell.remove()
          //   },
          //   onCancel() {
          //     console.log('Cancel');
          //   },
          // })
        }
        if (selectNode) {
          const connectedEdges = newGraph.getConnectedEdges(selectNode.cell)
          if (connectedEdges.length) {
            notification['error']({
              message: '删除失败',
              description:
                '请先删除节点相关的路线',
            });
          } else {
            selectNode.cell.remove()
            saveDrawList()
            const deleteID = selectNode.cell?.store?.data?.params?.id
            deleteID && dictDelete({id: deleteID})
          }
        }
      })

      let data = mapdata ? JSON.parse(mapdata): {cells: []};
      data.cells = data.cells.map(item=> {
        return {
          ...item,
          component(node) {
            if (item.hierarchy === 'site') {
              return (<div style={{background: '#6290fa',textAlign:'center',color: '#fff',height:'100%',lineHeight: '40px',borderRadius: '5px'}}>
                <EnvironmentOutlined style={{marginRight: '5px'}}/>{item.params.name}
              </div>)
            } else {
              return (<div style={{background: '#6290fa',textAlign:'center',color: '#fff',height:'100%',lineHeight: '40px',borderRadius: '5px'}}>
                <ApiOutlined style={{marginRight: '5px'}}/>{item.params.name}
              </div>)
            }
          },
          attrs: {
            line: {
              stroke: '#6290fa',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8,
              },
            },
          },
        }
      })

      drawData.nodeList.forEach((item)=> {
        const dataIndex = (data.cells || []).findIndex(nodeItem=> nodeItem.id === item.id)
        if (dataIndex !== -1) {
          const checkPositionNameIndex = (data.cells || []).findIndex(nodeItem=> nodeItem.params.name !== item.positionName)
          if (checkPositionNameIndex !== -1) {
            data.cells[dataIndex] = {
              ...data.cells[dataIndex],
              attrs: {
                ...data.cells[dataIndex].attrs,
              },
              params: {
                name: item.positionName,
                id: item.id
              }
            }
          } else {
            data.cells[dataIndex] = {
              ... data.cells[dataIndex],
              params: {
                name: item.positionName,
                id: item.id
              }
            }
          }
        }
      })

      data.cells?.length && drawData.edgesList.forEach((item)=> {
        const dataIndex = data.cells.findIndex(nodeItem=> {
          const startId = data.cells.filter(edgeItem=>edgeItem.id ===nodeItem.source?.cell)
          const endId = data.cells.filter(edgeItem=>edgeItem.id ===nodeItem.target?.cell)
          return startId[0]?.params?.id=== item.startPositionId  && endId[0]?.params?.id=== item.endPositionId
        })
        if (dataIndex !== -1) {
          data.cells[dataIndex] = {
            ...data.cells[dataIndex],
            params: {
              edgesId: item.id
            }
          }
        }
      })
      if (data.cells.length) {
        const nodeList = data.cells.filter((item)=> item.shape !== 'edge')
        const edgeList = data.cells.filter((item)=> item.shape === 'edge')
        nodeList.forEach((item, index)=> {
          const dataIndex = drawData.nodeList.findIndex(nodeItem=> nodeItem.id === item.params.id)
          dataIndex === -1 && data.cells.splice(index,1)   
        })
        edgeList.forEach((item, index)=> {
          const dataIndex = drawData.edgesList.findIndex(nodeItem=> nodeItem.id === item.params.edgesId)
          dataIndex === -1 && data.cells.splice(index+nodeList.length,1)   
        })
        newGraph.fromJSON({
          cells: data.cells
        })
        drawData.nodeList.forEach((item)=> {
          const dataIndex = nodeList.findIndex(nodeItem=> nodeItem.params.id === item.id)
          if (dataIndex === -1) {
            const x = item.x * 15
            const y = item.y * 15
            const positionName = item.positionName
            newGraph.addNode({
              shape: 'react-shape',
              width: 150,
              height: 40,
              x,
              y,
              component(node) {
                if (item.positionType !== "NORMAL") {
                  return <div style={{background: '#6290fa',textAlign:'center',color: '#fff',height:'100%',lineHeight: '40px',borderRadius: '5px'}}>
                    <EnvironmentOutlined style={{marginRight: '5px'}}/>{positionName}
                  </div>
                } else {
                  return <div style={{background: '#6290fa',textAlign:'center',color: '#fff',height:'100%',lineHeight: '40px',borderRadius: '5px'}}>
                    <ApiOutlined style={{marginRight: '5px'}}/>{positionName}
                  </div>
                }
              },
              ports: ports,
              params: {
                id: item.id,
                name:  positionName
              }
            })
          }
        })
      } else {
        newGraph.fromJSON({
          nodes: drawData.nodeList.map(item=> {
            const x = item.x * 15
            const y = item.y * 15
            return {
              id: item.id,
              params: {
                id: item.id,
                name: item.positionName
              },
              x,
              y,
              shape: 'react-shape',
              width: 110,
              height: 40,
              ports: ports,
              component(node) {
                if (item.hierarchy === 'site') {
                  return (<div style={{background: '#6290fa',textAlign:'center',color: '#fff',height:'100%',lineHeight: '40px',borderRadius: '5px'}}>
                    <EnvironmentOutlined style={{marginRight: '5px'}}/>{item.positionName}
                  </div>)
                } else {
                  return (<div style={{background: '#6290fa',textAlign:'center',color: '#fff',height:'100%',lineHeight: '40px',borderRadius: '5px'}}>
                    <ApiOutlined style={{marginRight: '5px'}}/>{item.positionName}
                  </div>)
                }
              }
            }
          }),
          edges: drawData.edgesList.map(item => {
            return {
              shape: 'edge',
              source: item.endPositionId,
              target: item.startPositionId,
              params: {
                edgesId: item.id
              },
              attrs: {
                line: {
                  stroke: '#6290fa',
                  strokeWidth: 2,
                  targetMarker: {
                    name: 'block',
                    width: 12,
                    height: 8,
                  },
                },
              },
            }
          })
        })
      }
      
    }
    
  }, [drawData, newGraph]);

  useEffect(() => {
    if (newGraph) {
      newGraph.drawBackground({
        image: backImgUrl,
        size: 'contain'
      })
    }
    
  }, [backImgUrl, newGraph]);



  const saveDrawList = async () => {
    let drawBoxData = newGraph.toJSON()
    saveModelsState({mapdata: JSON.stringify(drawBoxData)})
    dictSetMapData({mapId, mapData: JSON.stringify(drawBoxData)})
  }

  return (
    <div id="drawBox" style={{flex: 1}}/>
  );
};

export default forwardRef(DrawBox);
