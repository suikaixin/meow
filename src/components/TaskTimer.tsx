import React, { useState, useEffect } from 'react';
import { FaPowerOff } from 'react-icons/fa';
import styled from 'styled-components';

interface TaskTimerProps {
  isWorking: boolean;
}

const TimerContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
`;

const TimerIcon = styled.div<{ $isWorking: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $isWorking }) => $isWorking ? '#00ff00' : '#ff0000'};
  animation: none;

  @keyframes blinking {
    0% { opacity: 0.2; }
    50% { opacity: 1; }
    100% { opacity: 0.2; }
  }
`;

const PowerOffButton = styled.div`
  cursor: pointer;
  
  &:hover {
    color: #ff6b6b;
  }
`;

const TaskTimer: React.FC<TaskTimerProps> = ({ isWorking }) => {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isWorking) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorking]);
  
  // 格式化时间为 HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  return (
    <TimerContainer>
      <TimerIcon $isWorking={isWorking} />
        {formatTime(seconds)}
      <PowerOffButton>
        <FaPowerOff onClick={()=> {window.location.href = '/'}} />
      </PowerOffButton>
    </TimerContainer>
  );
};

export default TaskTimer; 