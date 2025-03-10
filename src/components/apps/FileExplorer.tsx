import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaFile, FaFolder } from 'react-icons/fa';

interface FileItem {
  type: 'filename' | 'toast';
  content: string;
  filePath?: string;
  fileContent?: string;
}

interface FileExplorerProps {
  content: FileItem[];
}

const Container = styled.div`
  display: flex;
  height: 100%;
  background: #f5f5f5;
`;

const Sidebar = styled.div`
  width: 200px;
  background: #e8e8e8;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  padding: 10px;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileListItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  background: ${props => props.$active ? '#d1d1d1' : 'transparent'};
  
  &:hover {
    background: #d1d1d1;
  }
`;

const FileIcon = styled.div`
  margin-right: 8px;
  color: #666;
`;

const FileName = styled.div`
  font-size: 13px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PreviewArea = styled.div`
  flex: 1;
  padding: 15px;
  overflow: auto;
`;

const PreviewContent = styled.pre`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 100%;
  overflow: auto;
`;

const Toast = styled.div`
  background: #fffde7;
  border-left: 4px solid #ffd600;
  padding: 12px 15px;
  margin-bottom: 15px;
  border-radius: 0 4px 4px 0;
  font-size: 13px;
`;

const NoSelection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
`;

const FileExplorer: React.FC<FileExplorerProps> = ({ content }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [toasts, setToasts] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  useEffect(() => {
    if (content) {
      // 处理文件
      const newFiles = content.filter(item => item.type === 'filename');
      setFiles(prevFiles => {
        const uniqueFiles = [...prevFiles];
        newFiles.forEach(newFile => {
          const existingIndex = uniqueFiles.findIndex(
            f => f.type === 'filename' && f.filePath === newFile.filePath
          );
          
          if (existingIndex >= 0) {
            uniqueFiles[existingIndex] = newFile;
          } else {
            uniqueFiles.push(newFile);
          }
        });
        return uniqueFiles;
      });
      
      // 处理通知
      const newToasts = content
        .filter(item => item.type === 'toast')
        .map(item => item.content);
      
      if (newToasts.length > 0) {
        setToasts(prev => [...prev, ...newToasts]);
      }
    }
  }, [content]);
  
  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file);
  };
  
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
              $active={selectedFile === file}
              onClick={() => handleFileClick(file)}
            >
              <FileIcon>
                <FaFile />
              </FileIcon>
              <FileName>
                {file.filePath ? file.filePath.split('/').pop() : file.content}
              </FileName>
            </FileListItem>
          ))}
        </FileList>
      </Sidebar>
      
      <PreviewArea>
        {toasts.map((toast, index) => (
          <Toast key={index}>{toast}</Toast>
        ))}
        
        {selectedFile ? (
          <PreviewContent>
            {selectedFile.fileContent || '(无内容)'}
          </PreviewContent>
        ) : (
          <NoSelection>
            <FaFolder size={40} color="#bbb" />
            <p style={{ marginTop: 10 }}>选择一个文件以预览</p>
          </NoSelection>
        )}
      </PreviewArea>
    </Container>
  );
};

export default FileExplorer; 