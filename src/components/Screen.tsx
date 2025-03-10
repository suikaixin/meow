import React from 'react';
import styled from 'styled-components';
import Dock from '@/components/Dock';
import AppWindow from '@/components/AppWindow';
import Image from 'next/image';
import { appNames } from '@/config/appConfig';

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
  height: 80vh;
  border-radius: 12px;
  border: 2px solid #888;
  overflow: hidden;
  position: relative;
  background: ${({ $power }) => $power === 'on' 
    ? 'linear-gradient(135deg, #6e45e2, #88d3ce)'
    : '#000'
  };
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
`;

const MeowAvatar = styled.div<{ $isWorking: boolean }>`
  position: absolute;
  bottom: 100px;
  right: 20px;
  width: 150px;
  height: 150px;
  z-index: 999;
  opacity: ${({ $isWorking }) => $isWorking ? 1 : 0};
  transition: opacity 0.3s ease;
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
          <MeowAvatar $isWorking={isWorking}>
            <Image 
              src={isWorking ? '/images/cat-key.gif' : '/images/cat-tea.gif'} 
              alt="Meow Avatar" 
              width={150} 
              height={150}
            />
          </MeowAvatar>
          <Dock 
            apps={appNames}
            activeApps={safeActiveApps}
            onToggleApp={onToggleApp}
          />
        </>
      )}
    </ScreenContainer>
  );
};

export default Screen; 