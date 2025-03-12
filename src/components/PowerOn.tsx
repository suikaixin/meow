import React, { useState } from 'react';
import { FaPowerOff } from 'react-icons/fa';
import styled from 'styled-components';

interface PowerOnProps {
  onPowerOn: (repoUrl: string) => void;
}

const PowerOnContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #f1f1f1;
  padding: 40px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  text-align: left;
  width: 600px;
`;

const Title = styled.p`
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 24px;
  width: 100%;
  text-align: left;
  color: #000;
  margin-top: 10px;
  margin-bottom: 40px;
`;

const TaskText = styled.p`
  font-size: 14px;
  color: #000;
  margin: 0;
  white-space: nowrap;
  border: none;

`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 10px;
  margin-bottom: 30px;
  border: none;
  border-bottom: 2px solid #000;
`;

const RepoInput = styled.input`
  font-size: 14px;
  border: none;
  color: #000;
  outline: none;
  padding-left: 10px;
  padding-right: 10px;
  flex: 1;
  min-width: 0;
  background: transparent;

  &:focus {
    border: none;
  }
`;

const PowerOnButton = styled.div`
  cursor: pointer;
  padding: 0px;
  display: flex;
  align-items: center;
  color: #000;
  
  &:hover {
    color: green;
  }
`;

const PowerOn: React.FC<PowerOnProps> = ({ onPowerOn }) => {
  const [repoUrl, setRepoUrl] = useState<string>('');
  
  return (
    <PowerOnContainer>
        <Title>
          Tell Meow Your Task
        </Title>
        <InputContainer>
          <TaskText>Clone the repo</TaskText>
          <RepoInput
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Enter the GitHub Repo URL"
          />
          <TaskText>and draw some figures !</TaskText>
        </InputContainer>
        <PowerOnButton>
          <FaPowerOff onClick={()=> {onPowerOn(repoUrl)}} />
        </PowerOnButton>
    </PowerOnContainer>
  );
};

export default PowerOn; 