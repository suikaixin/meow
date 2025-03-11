import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiEdit, FiEye, FiDownload } from 'react-icons/fi';

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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  padding: 10px;
`;

const DiagramCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
`;

const DiagramPreview = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  background: #f8f8f8;
  overflow: hidden;
  cursor: pointer;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const DiagramInfo = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DiagramTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #333;
  white-space: normal;
  word-wrap: break-all;
  overflow-wrap: break-all;
  line-height: 1.4;
  text-align: center;
  margin-bottom: 8px;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #000;
    background: #f0f0f0;
  }
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

  const openInDrawIO = (url: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    // 使用 app.diagrams.net 的编辑模式打开图表
    const editUrl = `https://app.diagrams.net/?url=${encodeURIComponent(url)}&title=${getFileNameFromUrl(url)}`;
    window.open(editUrl, '_blank');
  };

  const getPreviewUrl = (url: string) => {
    // 创建一个只读预览链接，添加更多参数以获得更大的预览
    // lightbox=1：使用灯箱模式（更大的缩放，无页面可见）
    // border=20：减小灯箱模式的边框宽度，默认为60
    // scale=1.5：增加缩放比例使图像更大
    // chrome=0：使用无浏览器的只读查看器
    // nav=1：启用折叠功能
    return `https://viewer.diagrams.net/?chrome=0&lightbox=1&border=20&scale=1.5&nav=1&toolbar=0&url=${encodeURIComponent(url)}&title=${getFileNameFromUrl(url)}`;
  };
  
  const openViewerOnly = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const viewerUrl = `https://viewer.diagrams.net/?chrome=0&nav=1&url=${encodeURIComponent(url)}&title=${getFileNameFromUrl(url)}`;
    window.open(viewerUrl, '_blank');
  };
  
  const downloadDiagram = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // 显示加载状态或提示信息（可选）
      
      // 获取文件内容
      const response = await fetch(url);
      const blob = await response.blob();
      
      // 创建一个临时的URL对象和下载链接
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = getFileNameFromUrl(url);
      
      // 添加链接到DOM并触发点击
      document.body.appendChild(link);
      link.click();
      
      // 清理临时对象
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('下载图表时出错:', error);
      // 可以在这里添加错误提示
    }
  };
  
  return (
    <Container ref={containerRef}>
      {diagrams.length > 0 ? (
        <GalleryGrid>
          {diagrams.map((diagram, index) => (
            <DiagramCard key={index}>
              <DiagramPreview onClick={() => openInDrawIO(diagram.content)}>
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
                <IconContainer>
                  <IconButton 
                    title="编辑图表" 
                    onClick={(e) => openInDrawIO(diagram.content, e)}
                  >
                    <FiEdit size={16} />
                  </IconButton>
                  <IconButton 
                    title="查看图表" 
                    onClick={(e) => openViewerOnly(diagram.content, e)}
                  >
                    <FiEye size={16} />
                  </IconButton>
                  <IconButton 
                    title="下载图表" 
                    onClick={(e) => downloadDiagram(diagram.content, e)}
                  >
                    <FiDownload size={16} />
                  </IconButton>
                </IconContainer>
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