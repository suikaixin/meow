import React from 'react';
import styled from 'styled-components';

interface TerminalItem {
  type: 'command' | 'stderr' | 'stdout';
  content: string;
}

interface TerminalProps {
  content: TerminalItem[];
}

const TerminalContainer = styled.div`
  background: #1e1e1e;
  color: #f0f0f0;
  padding: 12px;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  height: 100%;
  overflow-y: auto;
`;

const CommandLine = styled.div`
  color: #8be9fd;
  margin-bottom: 8px;
  white-space: pre-wrap;
  word-break: break-all;
  
  &:before {
    content: '$ ';
    color: #50fa7b;
  }
`;

const StdoutLine = styled.div`
  color: #f8f8f2;
  margin-bottom: 8px;
  white-space: pre-wrap;
  word-break: break-all;
`;

const StderrLine = styled.div`
  color: #ff5555;
  margin-bottom: 8px;
  white-space: pre-wrap;
  word-break: break-all;
`;

const Terminal: React.FC<TerminalProps> = ({ content }) => {
  return (
    <TerminalContainer>
      {content && content.map((item, index) => {
        switch (item.type) {
          case 'command':
            return <CommandLine key={index}>{item.content}</CommandLine>;
          case 'stdout':
            return <StdoutLine key={index}>{item.content}</StdoutLine>;
          case 'stderr':
            return <StderrLine key={index}>{item.content}</StderrLine>;
          default:
            return null;
        }
      })}
    </TerminalContainer>
  );
};

export default Terminal; 