import React from 'react';
import { useNodeDrag } from './useNodeDrag';
import { useDesignerStore } from '../../../store/designer';
import clsx from 'clsx';
import { NodeData, HandlePosition } from '../types';

interface NodeProps {
  data: NodeData;
}

const Handle: React.FC<{ type: 'source' | 'target', position: HandlePosition, nodeId: string }> = ({ type, position, nodeId }) => {
  const startConnection = useDesignerStore((state) => state.startConnection);
  const endConnection = useDesignerStore((state) => state.endConnection);
  const addEdge = useDesignerStore((state) => state.addEdge);
  const connection = useDesignerStore((state) => state.connection);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    startConnection(nodeId, position);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (connection.isConnecting && connection.sourceNodeId && connection.sourceNodeId !== nodeId) {
      addEdge({
        id: `${connection.sourceNodeId}-${nodeId}-${Date.now()}`,
        source: connection.sourceNodeId,
        target: nodeId,
      });
      endConnection();
    }
  };

  const style: React.CSSProperties = {
    position: 'absolute',
    width: 8,
    height: 8,
    background: '#1890ff',
    borderRadius: '50%',
    cursor: 'crosshair',
    zIndex: 10,
  };

  if (position === 'top') { style.top = -4; style.left = '50%'; style.transform = 'translateX(-50%)'; }
  if (position === 'right') { style.right = -4; style.top = '50%'; style.transform = 'translateY(-50%)'; }
  if (position === 'bottom') { style.bottom = -4; style.left = '50%'; style.transform = 'translateX(-50%)'; }
  if (position === 'left') { style.left = -4; style.top = '50%'; style.transform = 'translateY(-50%)'; }

  return <div style={style} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} />;
};

export const Node: React.FC<NodeProps> = ({ data }) => {
  const { id, x, y, label } = data;
  const { handleMouseDown, isDragging } = useNodeDrag(id, x, y);
  const selectedNodeId = useDesignerStore((state) => state.selectedNodeId);
  const selectNode = useDesignerStore((state) => state.selectNode);
  const removeNode = useDesignerStore((state) => state.removeNode);

  const isSelected = selectedNodeId === id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeNode(id);
  };

  return (
    <div
      className={clsx('designer-node', { selected: isSelected, dragging: isDragging })}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        position: 'absolute',
        cursor: 'move',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {isSelected && (
        <div 
          onClick={handleDelete}
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            width: 20,
            height: 20,
            background: '#ff4d4f',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 12,
            zIndex: 20
          }}
        >
          ×
        </div>
      )}
      <div className="node-content">
        {label || id}
      </div>
      <Handle type="source" position="top" nodeId={id} />
      <Handle type="source" position="right" nodeId={id} />
      <Handle type="source" position="bottom" nodeId={id} />
      <Handle type="source" position="left" nodeId={id} />
    </div>
  );
};
