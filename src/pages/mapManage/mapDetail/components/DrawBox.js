import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import '@antv/x6-react-shape';
import { notification } from 'antd';
import {
  EnvironmentOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'dva';
import { getGraph, ports, attrs } from '../constants';

const DrawBox = ({  backImgUrl, mapId, dictRelationDelete,saveModelsState,saveMapData, dictDelete },ref) => {

  let selectLine = ''
  let selectNode = ''

  const dispatch = useDispatch();  
  const dictRelationAdd = (payload) => dispatch({ type: 'mapDetail/dictRelationAdd', payload });
  const dictSetMapData = (payload) => dispatch({ type: 'mapDetail/dictSetMapData', payload });

  const { mapdata, drawData } = useSelector(
    (models) => models.mapDetail,
  ); 

  const [newGraph, setGraph] = useState();

  useImperativeHandle(ref, () => ({
    saveDrawList,
    getDrawList: ()=> {
      return newGraph.toJSON()
    }
  }))

  useEffect(()=> {
    const graph = getGraph()
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
    graph.on('edge:selected', (selectParams) => {
      selectNode = null
      selectLine = selectParams
      selectParams.cell.setAttrs({
        line: {
          stroke: 'red',
          strokeWidth: 3
        }
      })
    })
    graph.on('node:selected', (selectParams) => {     
      selectLine = null
      selectNode = selectParams
      graph.toggleSelectionMovable(false)
    })
    graph.bindKey(['Delete', 'Backspace'], (e) => {
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
        const connectedEdges = graph.getConnectedEdges(selectNode.cell)
        if (connectedEdges.length) {
          notification['error']({
            message: '删除失败',
            description:
              '请先删除节点相关的路线',
          });
        } else {
          selectNode.cell.remove()
          saveMapData()
          const deleteID = selectNode.cell?.store?.data?.params?.id
          deleteID && dictDelete({id: deleteID})
        }
      }
    })
    // #endregion
    setGraph(graph)
  },[])

  useEffect(() => {
    if (newGraph) {

      let data = mapdata ? JSON.parse(mapdata): {cells: []};

      // 节点添加参数
      drawData.nodeList.forEach((item)=> {
        const dataIndex = (data.cells || []).findIndex(nodeItem=> nodeItem.id === item.id)
        if (dataIndex !== -1) {
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
        }
      })

      data.cells = (data.cells || []).map(item=> {
        return {
          ...item,
            component: item && <div style={{background: '#6290fa',textAlign:'center',color: '#fff',height:'100%',lineHeight: '40px',borderRadius: '5px'}}>
            <EnvironmentOutlined style={{marginRight: '5px'}}/>{item?.params?.name}
          </div>,
          attrs: attrs,
        }
      })

      // 边添加参数
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
              component:  <div style={{background: '#6290fa',textAlign:'center',color: '#fff',height:'100%',lineHeight: '40px',borderRadius: '5px'}}>
              <EnvironmentOutlined style={{marginRight: '5px'}}/>{positionName}
            </div>,
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
              component: <div style={{background: '#6290fa',textAlign:'center',color: '#fff',height:'100%',lineHeight: '40px',borderRadius: '5px'}}>
              <EnvironmentOutlined style={{marginRight: '5px'}}/>{item.positionName}
            </div>
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
              attrs: attrs,
            }
          })
        })
      }
      
    }
    
  }, [drawData, newGraph]);

  useEffect(() => {
    if (newGraph) {
      newGraph.drawBackground({
        image: backImgUrl
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
