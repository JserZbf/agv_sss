import React, { useEffect, useRef, useState } from 'react';
import { Tree, Button, Upload } from 'antd';
import AutoScale from 'components/AutoScale';
import { useSelector, useDispatch } from 'dva';
import { useParams } from 'umi'
import BreadcrumbStyle from 'components/breadcrumbStyle';
import {
  EditOutlined,
  PlusOutlined,
  DownloadOutlined,
  BgColorsOutlined,
  UploadOutlined,
  RedoOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import styles from './index.less';
import DrawBox from './components/DrawBox';
import TreeInfoform from './components/TreeInfoform';

const MapDetail = function (props) {

  const drawBoxRef = useRef();


  const dispatch = useDispatch();
  const saveModelsState = (payload) => dispatch({ type: 'mapDetail/save', payload });
  const dictAdd = (payload) => dispatch({ type: 'mapDetail/dictAdd', payload });
  const dictUpdate = (payload) => dispatch({ type: 'mapDetail/dictUpdate', payload });
  const dictRelationUpdata = (payload) => dispatch({ type: 'mapDetail/dictRelationUpdata', payload });
  const dictDelete = (payload) => dispatch({ type: 'mapDetail/dictDelete', payload });
  const dictRelationDelete = (payload) => dispatch({ type: 'mapDetail/dictRelationDelete', payload });
  const dictRelationAdd = (payload) => dispatch({ type: 'mapDetail/dictRelationAdd', payload });
  const dictTreeData = (payload) => dispatch({ type: 'mapDetail/dictTreeData', payload });
  const dictSetMapData = (payload) => dispatch({ type: 'mapDetail/dictSetMapData', payload });
  const dictgetMapData = (payload) => dispatch({ type: 'mapDetail/dictgetMapData', payload });

  const { isAdd, treeInfoFormVisible,mapdata, treeSelectInfo, treeData, drawData , textData} = useSelector(
    (models) => models.mapDetail,
  );
  

  const { mapId } = useParams();

  const [backImgUrl, setBackImgUrl] = useState( window.sessionStorage.getItem(mapId))

  useEffect(() => {
    (async function fn(){
      await dictgetMapData({id: mapId})
      await dictTreeData({mapId})
    })()
    
  }, [mapId]);

  const onSelect = (info) => {
    if (info.hierarchy !== 'default') {
      saveModelsState({
        treeInfoFormVisible: true,
        treeSelectInfo: info,
        isAdd: false
      });
    }
    
  };

  const deleteInfo = (info) => {
    if (info.hierarchy === 'path') {
      dictRelationDelete({id: info.id})
    } else {
      dictDelete({id: info.id})
    }
  }

  const addTreeNode = (data) => {
    saveModelsState({
      treeInfoFormVisible: true,
      treeSelectInfo: data,
      isAdd: true

    });
  }

  // const uploadProps = {
  //   accept:'.png,.jpeg',
  //   action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  //   fileList,
  // };

  const saveMapData = () => {   
    drawBoxRef.current.saveDrawList()
  }

  return (
    <div className={styles.container}>
      <BreadcrumbStyle aheadTitle={[{ title: '地图管理' }]} currentTitle="地图详情" />
      <div className={styles.middleBox}>
        <div className={styles.treeBox}>
          <Tree
            treeData={treeData}
            blockNode={true}
            titleRender={
              (nodeData)=> {
                return <div className={styles.treeBoxEditBtn}>
                  <span>{nodeData.title}</span>
                  <span>
                    {
                      nodeData.canAdd && <Button
                        onClick={(event)=>{
                          addTreeNode(nodeData)
                          event.stopPropagation()
                        }}
                        className={styles.addBtn}
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />} 
                      />
                    }
                    {
                      (nodeData.hierarchy === 'site' || nodeData.hierarchy === 'node' || nodeData.hierarchy === 'path') 
                      && <span>
                        <Button
                          className={styles.editBtn}
                          onClick={(event)=>{
                            onSelect(nodeData)
                            event.stopPropagation()
                          }}
                          size="small"
                          type="primary"
                          icon={<EditOutlined />} 
                        />
                        <Button
                          className={styles.delBtn}
                          onClick={(event)=>{
                            deleteInfo(nodeData)
                            event.stopPropagation()
                          }}
                          size="small"
                          type="primary"
                          icon={<DeleteOutlined />} 
                        />
                      </span>
                    }
                  </span>
                </div>   
              }
            }
          />
        </div>
        <div className={styles.drawbox}>
          <div className={styles.buttonFlex}>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                className="addButton"
                onClick={() => {
                //导出结果
                function exportResult(text) {
                    // 下载文件方法
                    var funDownload = function(content, filename) {
                        var eleLink = document.createElement('a');
                        eleLink.download = filename;
                        eleLink.style.display = 'none';
                        // 字符内容转变成blob地址
                        var blob = new Blob([content], {
                          type: "application/json;charset=utf-8",
                        });
                        eleLink.href = URL.createObjectURL(blob);
                        // 触发点击
                        document.body.appendChild(eleLink);
                        eleLink.click();
                        // 然后移除
                        document.body.removeChild(eleLink);
                    };
                    if ('download' in document.createElement('a')) {
                        funDownload(text, '导出结果.json');
                    } else {
                        alert('浏览器不支持');
                    }
                }
                
                exportResult(JSON.stringify(textData))
                }}
              >
                导出地图
              </Button>
              <Upload 
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                >
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  className="addButton"
                >
                  导入地图
                </Button>
              </Upload>
              <Button
                type="primary"
                icon={<RedoOutlined />}
                className="addButton"
                onClick={() => {
                  saveMapData()
                }}
              >
                保存地图
              </Button>
              <Upload 
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                itemRender={() => (
                  null
                )}
                beforeUpload={(file) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onloadend = function () {
                    window.sessionStorage[`${mapId}`] = reader.result
                    setBackImgUrl(reader.result)
                  };
                  return false;
                }}
              >
                <Button
                  type="primary"
                  icon={<BgColorsOutlined />}
                  className="addButton"
                >
                  导入背景
                </Button>
              </Upload>
          </div>
          <DrawBox
            drawData={drawData}
            mapdata={mapdata}
            ref={drawBoxRef}
            dictRelationDelete={dictRelationDelete}
            dictRelationAdd={dictRelationAdd}
            saveModelsState={saveModelsState}
            dictDelete={dictDelete}
            dictSetMapData={dictSetMapData}
            saveMapData={saveMapData}
            backImgUrl={backImgUrl}
            mapId={mapId}
          />
        </div>
      </div>

      <TreeInfoform
        mapId={mapId}
        isAdd={isAdd}
        nodeData={drawData.nodeList}
        saveModelsState={saveModelsState}
        dictUpdate={dictUpdate}
        visible={treeInfoFormVisible}
        treeSelectInfo={treeSelectInfo}
        dictAdd={dictAdd}
        dictTreeData={dictTreeData}
        dictRelationUpdata={dictRelationUpdata}
      />
    </div>
  );
};

export default AutoScale(MapDetail);
