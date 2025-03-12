import React from 'react';
import styled from 'styled-components';
import Dock from '@/components/Dock';
import AppWindow from '@/components/AppWindow';
import { appNames } from '@/config/appConfig';
import TaskTimer from '@/components/TaskTimer';
import Meow from './Meow';

interface ScreenProps {
  power: 'on' | 'off';
  appWindows: Record<string, any>;
  activeApps: string[];
  onToggleApp: (appName: string) => void;
  onCloseApp: (appName: string) => void;
  isWorking: boolean;
}

const ScreenContainer = styled.div<{ $power: 'on' | 'off' }>`
  width: 100%;
  min-width: 1000px;
  height: 100;
  min-height: 800px;
  border-radius: 12px;
  border: 8px solid black;
  overflow: hidden;
  position: relative;
  background: ${({ $power }) => $power === 'on' 
    ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
    : 'linear-gradient(135deg, #666666 0%, #333333 100%)'
  };
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
`;


const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: #ff4444;
  max-width: 80%;
`;

const Screen: React.FC<ScreenProps> = ({ 
  power, 
  appWindows, 
  activeApps, 
  onToggleApp, 
  onCloseApp,
  isWorking
}) => {
  // 处理空内容
  const safeAppWindows = appWindows || {};
  const safeActiveApps = activeApps || [];
  
  return (
    <ScreenContainer $power={power}>
      {power === 'on' && (
        <>
          {safeActiveApps.map(appName => (
            <AppWindow 
              key={appName}
              appName={appName}
              content={safeAppWindows[appName] || []}
              onClose={() => onCloseApp(appName)}
            />
          ))}
          <Dock 
            apps={appNames}
            activeApps={safeActiveApps}
            onToggleApp={onToggleApp}
          />
          <TaskTimer isWorking={isWorking} />
         </>
      )}
      <Meow isWorking={isWorking} />
    </ScreenContainer>
  );
};

export default Screen; 