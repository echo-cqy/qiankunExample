import { useCallback, useEffect, useRef, useState } from 'react';
import { useDesignerStore } from '../../../store/designer';

export const useNodeDrag = (id: string, x: number, y: number) => {
  const updateNode = useDesignerStore((state) => state.updateNode);
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const initialNodePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    initialNodePos.current = { x, y };
  }, [x, y]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      updateNode(id, {
        x: initialNodePos.current.x + dx,
        y: initialNodePos.current.y + dy,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, id, updateNode]);

  return { handleMouseDown, isDragging };
};
