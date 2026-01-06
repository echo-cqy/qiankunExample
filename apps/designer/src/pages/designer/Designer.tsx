import React from 'react';
import { Canvas } from './canvas/Canvas';
import { PropertyPanel } from './sidebar/PropertyPanel';
import '../../styles/designer.less';

export const Designer: React.FC = () => {
  return (
    <div className="designer-layout">
      <div className="designer-content">
        <Canvas />
      </div>
      <PropertyPanel />
    </div>
  );
};
