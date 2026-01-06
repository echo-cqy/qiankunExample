export type HandlePosition = 'top' | 'right' | 'bottom' | 'left';

export interface NodeData {
  id: string;
  type: string;
  x: number;
  y: number;
  label?: string;
  [key: string]: any;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  [key: string]: any;
}

export interface DragItem {
  type: string;
  data?: any;
}
