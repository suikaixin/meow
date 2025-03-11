import React, { useState } from 'react';
import styled from 'styled-components';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

interface BrowserTab {
  id: string;
  url: string;
}

interface BrowserProps {
  content: { type: 'site', content: string }[];
}

const BrowserContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
`;

const TabBar = styled.div`
  display: flex;
  background: #e1e1e1;
  border-bottom: 1px solid #ccc;
  height: 36px;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #bbb;
  }
`;

const Tab = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 15px;
  min-width: 150px;
  max-width: 200px;
  height: 100%;
  background: ${props => props.$active ? '#fff' : '#e8e8e8'};
  border-right: 1px solid #ddd;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TabTitle = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const URLBar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
`;

const URLInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  border-radius: 15px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 12px;
  
  &:focus {
    border-color: #999;
  }
`;

const ContentFrame = styled.div`
  flex: 1;
  overflow: hidden;
`;

const IFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
`;

const SiteIcon = styled.div`
  font-size: 48px;
  margin-bottom: 0px;
  color: #333;
`;

const MessageTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
`;

const MessageText = styled.p`
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 20px;
  color: #666;
  max-width: 600px;
`;

const OpenLinkButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

// 检查URL是否属于已知不允许嵌入的网站
const isNonEmbeddableSite = (url: string): boolean => {
  const nonEmbeddableDomains = [
    'github.com', 
    'github.io',
    'twitter.com',
    'facebook.com',
    'instagram.com',
    'linkedin.com'
    // 可以根据需要添加更多
  ];
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    return nonEmbeddableDomains.some(blocked => domain.includes(blocked));
  } catch (e) {
    return false;
  }
};

// 根据URL返回适当的网站图标
const getSiteIcon = (url: string) => {
  if (url.includes('github.com')) {
    return <FaGithub />;
  }
  // 可以根据需要添加更多网站的图标判断
  return <FaExternalLinkAlt />;
};

// 渲染无法嵌入的网站的消息
const renderNonEmbeddableSiteMessage = (url: string) => {
  return (
    <MessageContainer>
      <SiteIcon>
        {getSiteIcon(url)}
      </SiteIcon>
      <MessageTitle>无法嵌入此网站</MessageTitle>
      <MessageText>
        由于内容安全策略(CSP)限制，{url.includes('github.com') ? 'GitHub' : '此网站'} 不允许在iframe中嵌入。
        <br />
        这是一种安全措施，用于保护用户免受点击劫持和其他类型的攻击。
      </MessageText>
      <OpenLinkButton href={url} target="_blank" rel="noopener noreferrer">
        <FaExternalLinkAlt size={14} /> 在外部打开
      </OpenLinkButton>
    </MessageContainer>
  );
};

const Browser: React.FC<BrowserProps> = ({ content }) => {
  // useEffect 里会处理所有的 content，所以这里初始化为空数组
  const [tabs, setTabs] = useState<BrowserTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  
  // 只在 content 变化时执行一次，完全替换标签页列表
  React.useEffect(() => {
    if (!content || content.length === 0) {
      return;
    }
    
    const siteContents = content.filter(item => item.type === 'site');
    
    if (siteContents.length > 0) {
      const newTabs = siteContents.map((item, index) => ({
        id: `tab-${index}`,
        url: item.content
      }));
      
      setTabs(newTabs);
      
      // 总是切换到最新的标签页
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  }, [content]);
  
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  
  return (
    <BrowserContainer>
      <TabBar>
        {tabs.map(tab => (
          <Tab 
            key={tab.id} 
            $active={tab.id === activeTabId}
            onClick={() => setActiveTabId(tab.id)}
          >
            <TabTitle>{tab.url}</TabTitle>
          </Tab>
        ))}
      </TabBar>
      
      <URLBar>
        <URLInput 
          type="text" 
          value={activeTab?.url || ''} 
          readOnly 
          placeholder="输入网址" 
        />
      </URLBar>
      
      <ContentFrame>
        {activeTab ? (
          isNonEmbeddableSite(activeTab.url) ? (
            renderNonEmbeddableSiteMessage(activeTab.url)
          ) : (
            <IFrame 
              src={activeTab.url} 
              title={activeTab.url} 
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          )
        ) : (
          <EmptyState>
            <p>没有打开的标签页</p>
          </EmptyState>
        )}
      </ContentFrame>
    </BrowserContainer>
  );
};

export default Browser; 