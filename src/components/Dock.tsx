import React from 'react';
import styled from 'styled-components';
import { appConfigs } from '@/config/appConfig';

interface DockProps {
  apps: string[];
  activeApps: string[];
  onToggleApp: (appName: string) => void;
}

const DockContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 12px 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const DockItem = styled.div<{ $isActive: boolean }>`
  width: 60px;
  height: 60px;
  margin: 0 8px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: ${({ $isActive }) => $isActive ? 'rgba(255, 255, 255, 0)' : 'transparent'};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -7px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    display: ${({ $isActive }) => $isActive ? 'block' : 'none'};
  }
`;

const IconWrapper = styled.div<{ $bgcolor: string }>`
  font-size: 32px;
  color: inherit;
  background-color: ${({ $bgcolor }) => $bgcolor};
  color:white;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Dock: React.FC<DockProps> = ({ apps, activeApps, onToggleApp }) => {
  // 为不同的应用定义颜色
  const appColors: Record<string, string> = {
    terminal: '#2e3436',
    browser: '#0078d7',
    file: '#ffbd2e',
    drawio: '#f08d0a',
    output: '#e74c3c'
  };

  return (
    <DockContainer>
      {apps.map(appName => {
        const AppIcon = appConfigs[appName].icon;
        const isActive = activeApps.includes(appName);
        const iconColor = appColors[appName] || '#ffffff';
        
        return (
          <DockItem 
            key={appName} 
            $isActive={isActive}
            onClick={() => onToggleApp(appName)}
          >
            <IconWrapper $bgcolor={iconColor}>
              <AppIcon />
            </IconWrapper>
          </DockItem>
        );
      })}
    </DockContainer>
  );
};

export default Dock; 