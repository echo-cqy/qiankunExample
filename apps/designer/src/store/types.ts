import { NodeData, EdgeData, HandlePosition } from '../pages/designer/types';

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface ConnectionState {
  isConnecting: boolean;
  sourceNodeId: string | null;
  sourceHandleId: HandlePosition | null;
  tempEdgeEnd: { x: number; y: number } | null;
}

export interface DesignerState {
  nodes: NodeData[];
  edges: EdgeData[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  viewport: Viewport;
  connection: ConnectionState;

  addNode: (node: NodeData) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  removeNode: (id: string) => void;
  
  addEdge: (edge: EdgeData) => void;
  removeEdge: (id: string) => void;
  
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  
  setViewport: (viewport: Partial<Viewport>) => void;
  
  startConnection: (nodeId: string, handleId: HandlePosition) => void;
  updateConnection: (pos: { x: number; y: number }) => void;
  endConnection: () => void;
}
