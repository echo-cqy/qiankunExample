import React from 'react';
import { useDesignerStore } from '../../../store/designer';
import { NodeForm } from './NodeForm';
import { DragItem } from '../types';

export const PropertyPanel: React.FC = () => {
  const selectedNodeId = useDesignerStore((state) => state.selectedNodeId);
  const nodes = useDesignerStore((state) => state.nodes);
  const updateNode = useDesignerStore((state) => state.updateNode);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleDragStart = (e: React.DragEvent, type: string) => {
    const item: DragItem = { type };
    e.dataTransfer.setData('application/react-dnd', JSON.stringify(item));
  };

  return (
    <div className="designer-sidebar" style={{ width: 300, borderLeft: '1px solid #ddd', padding: 16, background: '#fff' }}>
      <div className="component-list">
        <h3>Components</h3>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, 'Task')}
          style={{ padding: 8, border: '1px solid #ccc', marginBottom: 8, cursor: 'grab' }}
        >
          Task Node
        </div>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, 'Start')}
          style={{ padding: 8, border: '1px solid #ccc', marginBottom: 8, cursor: 'grab' }}
        >
          Start Node
        </div>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, 'End')}
          style={{ padding: 8, border: '1px solid #ccc', marginBottom: 8, cursor: 'grab' }}
        >
          End Node
        </div>
      </div>
      
      <div className="properties">
        <h3>Properties</h3>
        {selectedNode ? (
          <NodeForm data={selectedNode} onChange={(data) => updateNode(selectedNode.id, data)} />
        ) : (
          <p>Select a node to edit properties</p>
        )}
      </div>
    </div>
  );
};
