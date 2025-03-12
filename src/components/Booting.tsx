import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface BootingScreenProps {
  onBootComplete: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const BootingContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 100;
  animation: ${fadeIn} 0.5s ease;
`;

const ProgressContainer = styled.div`
  width: 300px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const Progress = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const StatusText = styled.div`
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 30px;
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;

const BootingScreen: React.FC<BootingScreenProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // 启动完成后调用回调
          setTimeout(() => {
            onBootComplete();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [onBootComplete]);
  
  const getStatusText = () => {
    if (progress < 30) return "System Booting...";
    if (progress < 60) return "Loading Core Components...";
    if (progress < 90) return "Preparing Application Environment...";
    return "Almost Done...";
  };

  return (
    <BootingContainer>
      <ProgressContainer>
        <Progress $progress={progress} />
      </ProgressContainer>
      <StatusText>{getStatusText()}</StatusText>
    </BootingContainer>
  );
};

export default BootingScreen;