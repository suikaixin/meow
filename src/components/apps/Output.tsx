import React from 'react';
import styled from 'styled-components';
import { FaSmile, FaSadTear } from 'react-icons/fa';

interface OutputItem {
  type: 'info' | 'error';
  content: string;
  timestamp?: number;
}

interface OutputProps {
  content: OutputItem[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f9f9f9;
  padding: 15px;
  overflow-y: auto;
`;

const JournalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eaeaea;
`;

const JournalTitle = styled.h2`
  font-size: 12px;
  color: #333;
  margin: 0;
`;

const JournalDate = styled.div`
  margin-left: auto;
  font-size: 12px;
  color: #888;
`;

const EntryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Entry = styled.div<{ $entryType: 'info' | 'error' }>`
  background: ${props => props.$entryType === 'error' ? '#fff0f0' : '#f0f8ff'};
  border-left: 4px solid ${props => props.$entryType === 'error' ? '#ff6b6b' : '#63a4ff'};
  border-radius: 0 8px 8px 0;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const EntryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const EntryIcon = styled.div<{ $color: string }>`
  margin-right: 10px;
  color: ${props => props.$color};
`;

const EntryTime = styled.div`
  margin-left: auto;
  font-size: 12px;
  color: #888;
`;

const EntryContent = styled.div`
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  text-align: center;
`;

const Output: React.FC<OutputProps> = ({ content }) => {
  const entries = content?.map(item => {
    // 检查内容是否包含error关键字来确定类型
    const type = item.type === 'error' || 
                (item.content && item.content.toLowerCase().includes('error')) 
                ? 'error' : 'info';
    
    return {
      ...item,
      type: type as 'info' | 'error',
      timestamp: item.timestamp || Date.now()
    };
  }) || [];
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };
  
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <Container>
      <JournalHeader>
        <JournalTitle>Meow Diary</JournalTitle>
        <JournalDate>{today}</JournalDate>
      </JournalHeader>
      
      {entries.length > 0 ? (
        <EntryList>
          {entries.map((entry, index) => (
            <Entry key={index} $entryType={entry.type}>
              <EntryHeader>
                <EntryIcon $color={entry.type === 'error' ? '#ff6b6b' : '#63a4ff'}>
                  {entry.type === 'error' ? <FaSadTear size={18} /> : <FaSmile size={18} />}
                </EntryIcon>
                <EntryTime>{formatTime(entry.timestamp)}</EntryTime>
              </EntryHeader>
              <EntryContent>{entry.content}</EntryContent>
            </Entry>
          ))}
        </EntryList>
      ) : (
        <EmptyState>
          <FaSmile size={40} color="#bbb" />
          <p style={{ marginTop: 10 }}>No Diary Record</p>
        </EmptyState>
      )}
    </Container>
  );
};

export default Output; 