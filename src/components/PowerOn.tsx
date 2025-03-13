import React, { useState } from 'react';
import { FaPowerOff } from 'react-icons/fa';
import styled from 'styled-components';

interface PowerOnProps {
  onPowerOn: (task: string, text: string) => void;
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

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  border: none;
`;


const TaskText = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const TaskSpan = styled.p`
  font-size: 14px;
  color: #000;
  margin: 0;
  white-space: nowrap;
  border: none;
`;

const TaskInput = styled.input`
  font-size: 14px;
  border: none;
  color: #000;
  outline: none;
  padding-left: 10px;
  padding-right: 10px;
  width:150px;
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
  margin-right: 10px;
  &:hover {
    color: green;
  }
`;

const PowerOn: React.FC<PowerOnProps> = ({ onPowerOn }) => {
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [topicText, setTopicText] = useState<string>('');
  
  return (
    <PowerOnContainer>
        <Title>
          Tell Meow Your Task
        </Title>
        <TaskList>
          <TaskItem>
            <PowerOnButton>
              <FaPowerOff onClick={()=> {onPowerOn('repo_diagram', repoUrl)}} />
            </PowerOnButton>
            <TaskText>
              <TaskSpan>Clone the repo</TaskSpan>
              <TaskInput
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="Enter the URL"
              />
              <TaskSpan>and draw some figures !</TaskSpan>
            </TaskText>
          </TaskItem>
          <TaskItem>
            <PowerOnButton>
              <FaPowerOff onClick={()=> {onPowerOn('deep_research',topicText)}} />
            </PowerOnButton>
            <TaskText>
              <TaskSpan>Deep research on the topic</TaskSpan>
              <TaskInput
                type="text"
                value={topicText}
                onChange={(e) => setTopicText(e.target.value)}
                placeholder="Enter the Topic"
              />
              <TaskSpan>and write a report !</TaskSpan>
            </TaskText>
          </TaskItem>
        </TaskList>
    </PowerOnContainer>
  );
};

export default PowerOn; 