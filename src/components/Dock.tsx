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
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 10px;
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
  background: ${({ $isActive }) => $isActive ? 'rgba(255, 255, 255, 0.3)' : 'transparent'};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.3);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: white;
    display: ${({ $isActive }) => $isActive ? 'block' : 'none'};
  }
`;

const IconWrapper = styled.div`
  font-size: 28px;
  color: white;
`;

const Dock: React.FC<DockProps> = ({ apps, activeApps, onToggleApp }) => {
  return (
    <DockContainer>
      {apps.map(appName => {
        const AppIcon = appConfigs[appName].icon;
        const isActive = activeApps.includes(appName);
        
        return (
          <DockItem 
            key={appName} 
            $isActive={isActive}
            onClick={() => onToggleApp(appName)}
          >
            <IconWrapper>
              <AppIcon />
            </IconWrapper>
          </DockItem>
        );
      })}
    </DockContainer>
  );
};

export default Dock; 