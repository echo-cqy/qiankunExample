import { useRef, useState, useEffect } from 'react';
import { useDesignerStore } from '../../../store/designer';
import { uuid } from '../../../utils/id';
import { DragItem } from '../types';

export const useCanvas = () => {
  const addNode = useDesignerStore((state) => state.addNode);
  const selectNode = useDesignerStore((state) => state.selectNode);
  const viewport = useDesignerStore((state) => state.viewport);
  const setViewport = useDesignerStore((state) => state.setViewport);
  const canvasRef = useRef<HTMLDivElement>(null);

  const connection = useDesignerStore((state) => state.connection);
  const updateConnection = useDesignerStore((state) => state.updateConnection);
  const endConnection = useDesignerStore((state) => state.endConnection);
  const selectedNodeId = useDesignerStore((state) => state.selectedNodeId);
  const selectedEdgeId = useDesignerStore((state) => state.selectedEdgeId);
  const removeNode = useDesignerStore((state) => state.removeNode);
  const removeEdge = useDesignerStore((state) => state.removeEdge);

  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/react-dnd');
    if (data) {
      const item: DragItem = JSON.parse(data);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        // Adjust drop coordinates based on viewport (pan & zoom)
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        
        const x = (clientX - viewport.x) / viewport.zoom;
        const y = (clientY - viewport.y) / viewport.zoom;

        addNode({
          id: uuid(),
          type: item.type,
          x,
          y,
          label: `New ${item.type}`,
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCanvasClick = () => {
    selectNode(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomSensitivity = 0.001;
        const newZoom = Math.min(Math.max(viewport.zoom - e.deltaY * zoomSensitivity, 0.1), 5);
        
        // Calculate zoom center
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const newX = mouseX - (mouseX - viewport.x) * (newZoom / viewport.zoom);
            const newY = mouseY - (mouseY - viewport.y) * (newZoom / viewport.zoom);
            
            setViewport({ zoom: newZoom, x: newX, y: newY });
        }
    } else {
        // Pan with wheel
        setViewport({
            x: viewport.x - e.deltaX,
            y: viewport.y - e.deltaY,
        });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle mouse button or Space + Left Click (handled by caller if needed)
    if (e.button === 1 || (e.button === 0 && e.altKey)) { 
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  useEffect(() => {
    if (!isPanning && !connection.isConnecting) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        
        setViewport({
          x: viewport.x + dx,
          y: viewport.y + dy,
        });
        
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }

      if (connection.isConnecting) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const clientX = e.clientX - rect.left;
          const clientY = e.clientY - rect.top;
          const x = (clientX - viewport.x) / viewport.zoom;
          const y = (clientY - viewport.y) / viewport.zoom;
          updateConnection({ x, y });
        }
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      if (connection.isConnecting) {
        endConnection();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, viewport, setViewport, connection.isConnecting, updateConnection, endConnection]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          removeNode(selectedNodeId);
        }
        if (selectedEdgeId) {
          removeEdge(selectedEdgeId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNodeId, selectedEdgeId, removeNode, removeEdge]);

  return { 
    canvasRef, 
    handleDrop, 
    handleDragOver, 
    handleCanvasClick, 
    handleWheel,
    handleMouseDown 
  };
};
