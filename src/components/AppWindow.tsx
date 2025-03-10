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

// 添加全局zIndex计数器，用于管理窗口层级
let globalZIndex = 100;
// 添加全局位置计数器
let positionIndex = 0;

const WindowContainer = styled.div.attrs<{ $position: Position; $size: Size; $zIndex: number }>(props => ({
  style: {
    transform: `translate(${props.$position.x}px, ${props.$position.y}px)`,
    width: `${props.$size.width}px`,
    height: `${props.$size.height}px`,
    zIndex: props.$zIndex,
  },
}))`
  position: absolute;
  left: 0;
  top: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  resize: both;
  will-change: transform; /* 提示浏览器做优化准备 */
`;

const TitleBar = styled.div.attrs(() => ({
  className: 'app-titlebar',
}))`
  height: 28px;
  background: #f1f1f1;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: move;
  position: relative; /* 使子元素可以相对于它定位 */
`;

const WindowButtons = styled.div`
  display: flex;
  gap: 6px;
  position: relative; /* 添加相对定位 */
  z-index: 10; /* 确保按钮位于最上层 */
  /* 隔离事件传播 */
  pointer-events: auto;
`;

const WindowButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.1s ease;
  user-select: none;
  -webkit-user-drag: none;
  position: relative; /* 确保按钮位置稳定 */
`;

const CloseButton = styled(WindowButton)`
  background: #ff5f56;
  &:hover {
    background: #ff3c2e;
  }
  /* 防止点击时按钮位置改变 */
  &:active {
    transform: none;
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
  // 根据应用名称确定位置区域
  const getInitialPosition = () => {
    // 定义固定的位置数组
    const positions = [
      { x: 50, y: 50 },    // 左上
      { x: 100, y: 100 },  // 右上偏移
      { x: 150, y: 150 },  // 左下偏移
      { x: 200, y: 200 },  // 右下偏移
      { x: 250, y: 250 }   // 中间偏移
    ];
    
    // 获取当前位置并更新计数器
    const position = positions[positionIndex % positions.length];
    positionIndex++;
    
    return position;
  };

  const [position, setPosition] = useState<Position>(getInitialPosition());
  const [size, setSize] = useState<Size>({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState<number>(globalZIndex++);
  
  const windowRef = useRef<HTMLDivElement>(null);
  
  // 当内容更新时，将窗口置顶
  useEffect(() => {
    setZIndex(++globalZIndex);
  }, [content]);
  
  // 窗口点击时也置顶
  const bringToFront = () => {
    setZIndex(++globalZIndex);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    // 确保只在标题栏拖拽时才处理
    if ((e.target as HTMLElement).closest('.app-titlebar')) {
      bringToFront();
      
      // 阻止事件冒泡，防止点击内容区域时触发拖拽
      e.stopPropagation();
      e.preventDefault();
      
      if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setIsDragging(true);
      }
    }
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // 直接设置位置，不使用requestAnimationFrame以避免延迟
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
  
  // 处理窗口点击事件
  const handleWindowClick = (e: React.MouseEvent) => {
    // 检查点击是否在控制按钮区域
    if (!(e.target as HTMLElement).closest('.window-buttons')) {
      bringToFront();
    }
  };
  
  const handleWindowButtonsMouseDown = (e: React.MouseEvent) => {
    // 防止按钮点击事件触发拖拽
    e.stopPropagation();
    // 防止事件冒泡到父元素
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleCloseButtonClick = (e: React.MouseEvent) => {
    // 立即阻止所有事件传播
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    
    // 使用requestAnimationFrame确保UI事件处理完毕后再关闭窗口
    requestAnimationFrame(() => {
      onClose();
    });
  };
  
  return (
    <WindowContainer 
      ref={windowRef} 
      $position={position} 
      $size={size} 
      $zIndex={zIndex} 
      onClick={handleWindowClick}
    >
      <TitleBar onMouseDown={handleMouseDown}>
        <WindowButtons 
          className="window-buttons"
          onMouseDown={handleWindowButtonsMouseDown}
        >
          <CloseButton 
            onMouseDown={(e) => {
              // 立即阻止所有事件传播和默认行为
              e.stopPropagation();
              e.preventDefault();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onClick={handleCloseButtonClick} 
          />
          <MinimizeButton onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }} />
          <MaximizeButton onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }} />
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