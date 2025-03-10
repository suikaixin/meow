import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

interface DrawIOItem {
  type: 'fileurl';
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
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

const DiagramImage = styled.div`
  width: 100%;
  height: 180px;
  position: relative;
  background: #f8f8f8;
  
  img {
    object-fit: contain;
  }
`;

const DiagramInfo = styled.div`
  padding: 12px;
`;

const DiagramTitle = styled.div`
  font-size: 14px;
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
`;

const DrawIO: React.FC<DrawIOProps> = ({ content }) => {
  const diagrams = content?.filter(item => item.type === 'fileurl') || [];
  
  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      return path.split('/').pop() || '图表';
    } catch {
      return '图表';
    }
  };
  
  return (
    <Container>
      {diagrams.length > 0 ? (
        <GalleryGrid>
          {diagrams.map((diagram, index) => (
            <DiagramCard key={index}>
              <DiagramImage>
                <Image 
                  src={diagram.content} 
                  alt={`图表 ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </DiagramImage>
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
          <h3>没有可用的图表</h3>
          <p>当生成图表时，它们将显示在这里</p>
        </EmptyState>
      )}
    </Container>
  );
};

export default DrawIO; 