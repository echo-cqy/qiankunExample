import React from 'react';
import { useDesignerStore } from '../../../store/designer';
import { NodeData } from '../types';

const getHandlePosition = (node: NodeData, handlePosition: 'top' | 'right' | 'bottom' | 'left' = 'right') => {
  const { x, y } = node;
  const width = 100; // Node width
  const height = 40; // Node height

  switch (handlePosition) {
    case 'top': return { x: x + width / 2, y };
    case 'right': return { x: x + width, y: y + height / 2 };
    case 'bottom': return { x: x + width / 2, y: y + height };
    case 'left': return { x, y: y + height / 2 };
    default: return { x: x + width / 2, y: y + height / 2 };
  }
};

const getBezierPath = (sourceX: number, sourceY: number, targetX: number, targetY: number) => {
  const dx = Math.abs(targetX - sourceX);
  const controlPointOffset = Math.max(dx * 0.5, 50);
  
  return `M${sourceX},${sourceY} C${sourceX + controlPointOffset},${sourceY} ${targetX - controlPointOffset},${targetY} ${targetX},${targetY}`;
};

export const EdgeLayer: React.FC = () => {
  const edges = useDesignerStore((state) => state.edges);
  const nodes = useDesignerStore((state) => state.nodes);
  const connection = useDesignerStore((state) => state.connection);
  const selectedEdgeId = useDesignerStore((state) => state.selectedEdgeId);
  const selectEdge = useDesignerStore((state) => state.selectEdge);

  const getNode = (id: string) => nodes.find((n) => n.id === id);

  return (
    <svg className="designer-edges-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#999" />
        </marker>
        <marker id="arrowhead-selected" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#1890ff" />
        </marker>
      </defs>
      
      {edges.map((edge) => {
        const sourceNode = getNode(edge.source);
        const targetNode = getNode(edge.target);
        if (!sourceNode || !targetNode) return null;

        // Default to right-to-left connection for now, can be enhanced to store handle IDs
        const start = getHandlePosition(sourceNode, 'right');
        const end = getHandlePosition(targetNode, 'left');
        
        const path = getBezierPath(start.x, start.y, end.x, end.y);
        const isSelected = selectedEdgeId === edge.id;

        return (
          <g key={edge.id} onClick={(e) => { e.stopPropagation(); selectEdge(edge.id); }} style={{ pointerEvents: 'all', cursor: 'pointer' }}>
            {/* Transparent wide path for easier selection */}
            <path
              d={path}
              stroke="transparent"
              strokeWidth="20"
              fill="none"
            />
            {/* Visible path */}
            <path
              d={path}
              stroke={isSelected ? '#1890ff' : '#999'}
              strokeWidth={isSelected ? 3 : 2}
              fill="none"
              markerEnd={isSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'}
            />
          </g>
        );
      })}

      {connection.isConnecting && connection.sourceNodeId && connection.tempEdgeEnd && (
        (() => {
          const sourceNode = getNode(connection.sourceNodeId);
          if (!sourceNode) return null;
          
          const start = getHandlePosition(sourceNode, connection.sourceHandleId || 'right');
          const end = connection.tempEdgeEnd;
          
          const path = getBezierPath(start.x, start.y, end.x, end.y);

          return (
            <path
              d={path}
              stroke="#1890ff"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              markerEnd="url(#arrowhead)"
            />
          );
        })()
      )}
    </svg>
  );
};
