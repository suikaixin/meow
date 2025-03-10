import React, { useState } from 'react';
import styled from 'styled-components';

interface PowerOnProps {
  onPowerOn: (repoUrl: string) => void;
}

const PowerOnContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  text-align: left;
  width: 700px;
`;

const GlassPanel = styled.div`
  padding: 40px;
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
`;

const TaskText = styled.p`
  font-size: 56px;
  color: #333;
  margin-top: 20px;
  margin-bottom: 60px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  line-height: 1.5;
`;

const TaskTextSub = styled.p`
  font-size: 16px;
  color: #333;
  margin: 0;
  white-space: nowrap;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #333;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
`;

const RepoInput = styled.input`
  border-radius: 0px;
  font-size: 16px;
  border: none;
  color: #666;
  outline: none;
  padding-left: 10px;
  padding-right: 10px;
  flex: 1;
  min-width: 0;

  &:focus {
    border: none;
  }
`;

const PowerButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #333;
  background: white;
  color: #666;
  font-size: 48px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 40px auto 20px auto;

  &::after {
    content: "⏻";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  &:hover {
    color: #333;
    font-weight: 600;
    box-shadow: 0 6px 12px rgba(99, 102, 241, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const PowerOn: React.FC<PowerOnProps> = ({ onPowerOn }) => {
  const [repoUrl, setRepoUrl] = useState<string>('https://github.com/octocat/Hello-World');
  
  return (
    <PowerOnContainer>
      <GlassPanel>
        <TaskText>
          Tell Meow Your Task
        </TaskText>
        <InputContainer>
          <TaskTextSub>Clone the repo</TaskTextSub>
          <RepoInput
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Enter the GitHub repo URL"
          />
          <TaskTextSub>and draw some figures</TaskTextSub>
        </InputContainer>
        <PowerButton onClick={() => onPowerOn(repoUrl)} aria-label="Power On" />
      </GlassPanel>
    </PowerOnContainer>
  );
};

export default PowerOn; 