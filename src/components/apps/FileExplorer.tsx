import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaFile, FaFolder, FaEdit, FaEye } from 'react-icons/fa';

interface FileItem {
  type: 'file-info' | 'file-name-write' | 'file-name-read';
  content: string;
}

interface FileExplorerProps {
  content: FileItem[];
}

const Container = styled.div`
  display: flex;
  height: 100%;
  background: #f8f9fa;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Sidebar = styled.div`
  width: 220px;
  background: #f0f2f5;
  border-right: 1px solid #e3e5e8;
  overflow-y: auto;
  padding: 12px 6px;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FileListItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: flex-start;
  padding: 10px 8px;
  cursor: pointer;
  border-radius: 5px;
  background: ${props => props.$active ? '#e2e6ea' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background: #e2e6ea;
  }
`;

const FileIcon = styled.div`
  margin-right: 10px;
  color: #5c6370;
  min-width: 16px;
`;

const FileName = styled.div`
  font-size: 13.5px;
  flex: 1;
  white-space: normal;
  word-break: break-all;
  color: #444;
`;

const PreviewArea = styled.div`
  flex: 1;
  padding: 18px;
  overflow: auto;
  background: #ffffff;
`;

const PreviewContent = styled.pre`
  background: #fff;
  border: 1px solid #eaecef;
  border-radius: 6px;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 100%;
  overflow: auto;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

const Toast = styled.div`
  background: #fff8e1;
  border-left: 4px solid #ffca28;
  padding: 14px 16px;
  margin-bottom: 16px;
  border-radius: 0 6px 6px 0;
  font-size: 13px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const NoSelection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9aa5b1;
`;

const FileExplorer: React.FC<FileExplorerProps> = ({ content }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [infoContent, setInfoContent] = useState<string[]>([]);
  const previewAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (content) {
      // 处理文件，移除去重逻辑，直接添加所有文件
      const newFiles = content
        .filter(item => item.type.startsWith('file-name'));
      if (newFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
      }
      
      // 处理预览区内容（file-info 类型）
      const newInfos = content
        .filter(item => item.type === 'file-info')
        .map(item => item.content);
      
      if (newInfos.length > 0) {
        setInfoContent(prev => [...prev, ...newInfos]);
      }
    }
  }, [content]);

  // 添加内容后自动滚动到底部
  useEffect(() => {
    if (previewAreaRef.current && infoContent.length > 0) {
      previewAreaRef.current.scrollTop = previewAreaRef.current.scrollHeight;
    }
  }, [infoContent]);
  
  const getFileExtension = (filename: string) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };
  
  return (
    <Container>
      <Sidebar>
        <FileList>
          {files.map((file, index) => (
            <FileListItem 
              key={index} 
              $active={false}
            >
              <FileIcon>
                {file.type === 'file-name-write' ? (
                  <FaEdit />
                ) : file.type === 'file-name-read' ? (
                  <FaEye />
                ) : (
                  <FaFile />
                )}
              </FileIcon>
              <FileName>{file.content}</FileName>
            </FileListItem>
          ))}
        </FileList>
      </Sidebar>
      
      <PreviewArea ref={previewAreaRef}>
        {infoContent.length > 0 ? (
          infoContent.map((info, index) => (
            <PreviewContent key={index}>
              {info || '(无内容)'}
            </PreviewContent>
          ))
        ) : (
          <NoSelection>
            <FaFolder size={48} color="#c4cad4" />
            <p style={{ marginTop: 12, fontSize: '14px' }}>暂无信息内容</p>
          </NoSelection>
        )}
      </PreviewArea>
    </Container>
  );
};

export default FileExplorer; 