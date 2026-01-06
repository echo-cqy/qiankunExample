import { create } from 'zustand';
import { DesignerState } from './types';

export const useDesignerStore = create<DesignerState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  viewport: { x: 0, y: 0, zoom: 1 },
  connection: {
    isConnecting: false,
    sourceNodeId: null,
    sourceHandleId: null,
    tempEdgeEnd: null,
  },

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  
  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...data } : node
      ),
    })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
    })),

  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),

  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    })),

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),

  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  setViewport: (viewport) =>
    set((state) => ({
      viewport: { ...state.viewport, ...viewport },
    })),

  startConnection: (nodeId, handleId) =>
    set({
      connection: {
        isConnecting: true,
        sourceNodeId: nodeId,
        sourceHandleId: handleId,
        tempEdgeEnd: null,
      },
    }),

  updateConnection: (pos) =>
    set((state) => ({
      connection: { ...state.connection, tempEdgeEnd: pos },
    })),

  endConnection: () =>
    set({
      connection: {
        isConnecting: false,
        sourceNodeId: null,
        sourceHandleId: null,
        tempEdgeEnd: null,
      },
    }),
}));
