import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

interface DrawIOItem {
  type: 'drawio-file';
  content: string;
}

interface DrawIOProps {
  content: DrawIOItem[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f0f0f0;
  padding: 15px;
  overflow-y: auto;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  padding: 10px;
`;

const DiagramCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
`;

const DiagramPreview = styled.div`
  width: 100%;
  height: 150px;
  position: relative;
  background: #f8f8f8;
  overflow: hidden;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const DiagramPlaceholder = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  color: #666;
  font-size: 12px;
`;

const DiagramInfo = styled.div`
  padding: 10px;
`;

const DiagramTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  text-align: center;
  padding: 20px;
  line-height: 2;
`;

const EmptyStateBold = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const DrawIO: React.FC<DrawIOProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const diagrams = content?.filter(item => item.type === 'drawio-file') || [];
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content]);
  
  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      return path.split('/').pop() || '图表';
    } catch {
      return '图表';
    }
  };

  const openInDrawIO = (url: string) => {
    // 使用 app.diagrams.net 的编辑模式打开图表
    const editUrl = `https://app.diagrams.net/?url=${encodeURIComponent(url)}&title=${getFileNameFromUrl(url)}`;
    window.open(editUrl, '_blank');
  };

  const getPreviewUrl = (url: string) => {
    // 创建一个只读预览链接（使用 chrome=0 参数禁用工具栏）
    return `https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1&toolbar=0&url=${encodeURIComponent(url)}`;
  };
  
  return (
    <Container ref={containerRef}>
      {diagrams.length > 0 ? (
        <GalleryGrid>
          {diagrams.map((diagram, index) => (
            <DiagramCard 
              key={index} 
              onClick={() => openInDrawIO(diagram.content)}
            >
              <DiagramPreview>
                <iframe 
                  src={getPreviewUrl(diagram.content)} 
                  title={`图表预览 ${index + 1}`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
              </DiagramPreview>
              <DiagramInfo>
                <DiagramTitle>
                  {getFileNameFromUrl(diagram.content)}
                </DiagramTitle>
              </DiagramInfo>
            </DiagramCard>
          ))}
        </GalleryGrid>
      ) : (
        <EmptyState>
          <EmptyStateBold>没有可用的图表</EmptyStateBold>
          当生成图表时，它们将显示在这里
        </EmptyState>
      )}
    </Container>
  );
};

export default DrawIO; 