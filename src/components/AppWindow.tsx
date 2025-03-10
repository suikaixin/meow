import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { appConfigs } from '@/config/appConfig';
import Terminal from '@/components/apps/Terminal';
import Browser from '@/components/apps/Browser';
import FileExplorer from '@/components/apps/FileExplorer';
import DrawIO from '@/components/apps/DrawIO';
import Output from '@/components/apps/Output';

interface AppWindowProps {
  appName: string;
  content: any;
  onClose: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

const WindowContainer = styled.div.attrs<{ $position: Position; $size: Size }>(props => ({
  style: {
    left: `${props.$position.x}px`,
    top: `${props.$position.y}px`,
    width: `${props.$size.width}px`,
    height: `${props.$size.height}px`,
  },
}))`
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  resize: both;
  z-index: 10;
`;

const TitleBar = styled.div`
  height: 28px;
  background: #f1f1f1;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: move;
`;

const WindowButtons = styled.div`
  display: flex;
  gap: 6px;
`;

const WindowButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
`;

const CloseButton = styled(WindowButton)`
  background: #ff5f56;
  &:hover {
    background: #ff3c2e;
  }
`;

const MinimizeButton = styled(WindowButton)`
  background: #ffbd2e;
  &:hover {
    background: #f9a100;
  }
`;

const MaximizeButton = styled(WindowButton)`
  background: #27c93f;
  &:hover {
    background: #1db334;
  }
`;

const WindowTitle = styled.div`
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-left: -42px; /* 补偿按钮的宽度，使标题居中 */
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow: auto;
  background: white;
`;

const AppWindow: React.FC<AppWindowProps> = ({ appName, content, onClose }) => {
  const [position, setPosition] = useState<Position>({
    x: Math.random() * 200 + 100,
    y: Math.random() * 100 + 50
  });
  const [size, setSize] = useState<Size>({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  
  const windowRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);
  
  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        setSize({
          width: rect.width,
          height: rect.height
        });
      }
    };
    
    const resizeObserver = new ResizeObserver(handleResize);
    if (windowRef.current) {
      resizeObserver.observe(windowRef.current);
    }
    
    return () => {
      if (windowRef.current) {
        resizeObserver.unobserve(windowRef.current);
      }
    };
  }, []);
  
  const renderAppContent = () => {
    switch (appName) {
      case 'terminal':
        return <Terminal content={content} />;
      case 'browser':
        return <Browser content={content} />;
      case 'file':
        return <FileExplorer content={content} />;
      case 'drawio':
        return <DrawIO content={content} />;
      case 'output':
        return <Output content={content} />;
      default:
        return <div>未知应用</div>;
    }
  };
  
  return (
    <WindowContainer ref={windowRef} $position={position} $size={size}>
      <TitleBar onMouseDown={handleMouseDown}>
        <WindowButtons>
          <CloseButton onClick={onClose} />
          <MinimizeButton />
          <MaximizeButton />
        </WindowButtons>
        <WindowTitle>{appConfigs[appName].name}</WindowTitle>
      </TitleBar>
      <ContentContainer>
        {renderAppContent()}
      </ContentContainer>
    </WindowContainer>
  );
};

export default AppWindow; 