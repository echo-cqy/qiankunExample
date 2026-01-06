import React from 'react';
import { useDesignerStore } from '../../../store/designer';
import { Node } from '../nodes/Node';
import { EdgeLayer } from '../edges/EdgeLayer';
import { useCanvas } from './useCanvas';

export const Canvas: React.FC = () => {
  const nodes = useDesignerStore((state) => state.nodes);
  const viewport = useDesignerStore((state) => state.viewport);
  const { canvasRef, handleDrop, handleDragOver, handleCanvasClick, handleWheel, handleMouseDown } = useCanvas();

  return (
    <div
      className="designer-canvas"
      ref={canvasRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#f0f2f5' }}
    >
      <div
        className="transform-layer"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      >
        <EdgeLayer />
        {nodes.map((node) => (
          <Node key={node.id} data={node} />
        ))}
      </div>
    </div>
  );
};
