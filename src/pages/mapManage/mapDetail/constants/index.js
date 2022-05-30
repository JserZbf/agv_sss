
import { Graph, Shape } from '@antv/x6';

export const getGraph = ()=> {
    const graph = new Graph({
        container: document.getElementById('drawBox'),
        autoResize: false,
        scroller: {
          enabled: true,
        },
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          global: true,
          modifiers: ['shift', 'meta'],
          minScale: 0.5,
          maxScale: 2,
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
    // #endregion
    return graph
}

export const ports = {
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

export const attrs = {
    line: {
      stroke: '#6290fa',
      strokeWidth: 2,
      targetMarker: {
        name: 'block',
        width: 12,
        height: 8,
      },
    },
  }