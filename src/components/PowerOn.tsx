import React, { useState } from 'react';
import styled from 'styled-components';

interface PowerOnProps {
  onPowerOn: (repoUrl: string) => void;
}

const PowerOnContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const GlassPanel = styled.div`
  padding: 40px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 80%;
`;

const TaskText = styled.p`
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 30px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  line-height: 1.5;
`;

const RepoInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
  outline: none;
  
  &:focus {
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }
`;

const PowerButton = styled.button`
  padding: 12px 30px;
  border-radius: 30px;
  border: none;
  background: linear-gradient(135deg, #67B26F, #4ca2cd);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const PowerOn: React.FC<PowerOnProps> = ({ onPowerOn }) => {
  const [repoUrl, setRepoUrl] = useState<string>('https://github.com/kr4t0n/gitmesh');
  
  return (
    <PowerOnContainer>
      <GlassPanel>
        <TaskText>
          Clone this repo, @{repoUrl.split('/').slice(-2).join('/')} and draw some figures
        </TaskText>
        <RepoInput
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="输入GitHub仓库地址"
        />
        <PowerButton onClick={() => onPowerOn(repoUrl)}>
          开机
        </PowerButton>
      </GlassPanel>
    </PowerOnContainer>
  );
};

export default PowerOn; 