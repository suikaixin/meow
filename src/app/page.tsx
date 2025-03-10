'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Screen from '@/components/Screen';
import PowerOn from '@/components/PowerOn';
import { appNames } from '@/config/appConfig';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Slogan = styled.h1`
  font-size: 36px;
  color: #333;
  margin-bottom: 20px;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
`;

// 处理SSE数据的类型
interface SSEData {
  app: string;
  data: any;
}

export default function Home() {
  const [power, setPower] = useState<'on' | 'off'>('off');
  const [isBooting, setIsBooting] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [activeApps, setActiveApps] = useState<string[]>([]);
  const [appWindows, setAppWindows] = useState<Record<string, any>>({});
  
  // 处理开机
  const handlePowerOn = async (repoUrl: string) => {
    setIsBooting(true);
    
    // 模拟开机动画
    setTimeout(() => {
      setPower('on');
      setIsBooting(false);
      setIsWorking(true);
      
      // 默认打开terminal和output
      setActiveApps(['terminal', 'output', 'browser']);
      
      // 调用SSE API
      fetchSSEData(repoUrl);
    }, 2000);
  };
  
  // 处理应用切换
  const handleToggleApp = (appName: string) => {
    setActiveApps(prev => {
      if (prev.includes(appName)) {
        return prev;
      } else {
        return [...prev, appName];
      }
    });
  };
  
  // 处理关闭应用
  const handleCloseApp = (appName: string) => {
    setActiveApps(prev => prev.filter(app => app !== appName));
  };
  
  // 调用SSE API
  const fetchSSEData = (repoUrl: string) => {
    // 提取仓库信息
    const repoInfo = repoUrl.split('/');
    const site = repoUrl;
    
    console.log(`[SSE] 开始获取数据，仓库地址: ${repoUrl}`);
    
    // 初始化应用内容
    appNames.forEach(appName => {
      console.log(`[SSE] 初始化应用 ${appName}`);
      setAppWindows(prev => ({
        ...prev,
        [appName]: []
      }));
    });

    // 添加初始信息到browser
    updateAppContent('browser', {
      type: 'site',
      content: 'https://poster.docmesh.tech'
    });
    
    // 添加初始命令到terminal
    updateAppContent('terminal', {
      type: 'command',
      content: `git clone ${repoUrl}`
    });
    
    // 添加初始信息到output
    updateAppContent('output', {
      type: 'info',
      content: `开始处理仓库: ${repoUrl}`,
      timestamp: Date.now()
    });
    
    try {
      // 仅在客户端执行
      if (typeof window === 'undefined') return;
      
      console.log(`[SSE] 发起SSE连接请求...`);
      
      // 使用 fetch API 替代 EventSource 来支持 POST 方法的 SSE
      fetch('https://kr4t0n--gitmesh-agent-fastapi-app.modal.run/aexecute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({ site: "https://github.com/octocat/Hello-World" })
      })
      .then(response => {
        if (!response.ok) {
          console.error(`[SSE] 请求失败，状态码: ${response.status}`);
          throw new Error(`HTTP 错误 ${response.status}`);
        }
        
        console.log(`[SSE] 连接成功，开始读取数据流`);
        
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        function readStream() {
          reader.read().then(({ done, value }) => {
            if (done) {
              console.log('[SSE] 数据流读取完成');
              return;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            
            console.log(`[SSE] 收到新数据块: ${chunk.length} 字节`);
            
            // 处理缓冲区中的完整 SSE 消息
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || '';
            
            console.log(`[SSE] 解析到 ${lines.length} 条消息`);
            
            for (const line of lines) {
              if (line.trim() === '') continue;
              try {
                // 从 SSE 格式中提取数据
                const dataMatch = line.match(/data: (.+)$/m);
                if (dataMatch && dataMatch[1]) {
                  const data = JSON.parse(dataMatch[1]);
                  console.log('[SSE] 接收到数据:', JSON.stringify(data, null, 2));
                  processSSEData(data);
                } else {
                  console.warn('[SSE] 无法从消息中提取数据:', line);
                }
              } catch (error) {
                console.error('[SSE] 解析数据错误:', error, '原始消息:', line);
              }
            }
            
            // 继续读取流
            readStream();
          }).catch(error => {
            console.error('[SSE] 读取流时出错:', error);
            updateAppContent('output', {
              type: 'error',
              content: `SSE 连接错误: ${error.message}`,
              timestamp: Date.now()
            });
          });
        }
        
        console.log('[SSE] 开始读取数据流');
        readStream();
      })
      .catch(error => {
        console.error('[SSE] 建立连接错误:', error);
        updateAppContent('output', {
          type: 'error',
          content: `请求失败: ${error.message}`,
          timestamp: Date.now()
        });
      });
      
    } catch (error: any) {
      console.error('[SSE] 异常:', error);
      updateAppContent('output', {
        type: 'error',
        content: `连接错误: ${error.message}`,
        timestamp: Date.now()
      });
    }
  };
  
  // 处理SSE数据
  const processSSEData = (data: SSEData) => {
    console.log(`[SSE处理] 开始处理数据:`, data);
    
    const { app, data: appData } = data;
    
    if (!app || !appData) {
      console.error('[SSE处理] 无效的数据格式:', data);
      return;
    }
    
    console.log(`[SSE处理] 处理 ${app} 应用的数据:`, appData);
    
    // 根据app类型处理数据
    switch (app) {
      case 'terminal':
        processTerminalData(appData);
        break;
      case 'browser':
        processBrowserData(appData);
        break;
      case 'file':
        processFileData(appData);
        break;
      case 'drawio':
        processDrawIOData(appData);
        break;
      case 'output':
        processOutputData(appData);
        break;
      default:
        console.warn('[SSE处理] 未知的应用类型:', app);
        break;
    }
    
    // 确保相关应用窗口打开
    if (!activeApps.includes(app)) {
      console.log(`[SSE处理] 自动打开应用: ${app}`);
      handleToggleApp(app);
    }
  };
  
  // 处理Terminal数据
  const processTerminalData = (data: any) => {
    console.log('[Terminal处理] 接收到数据:', data);
    
    if (data.command) {
      console.log('[Terminal处理] 添加命令:', data.command);
      updateAppContent('terminal', {
        type: 'command',
        content: data.command
      });
    } else if (data.observation) {
      // 如果data.observation是字符串，使用正则表达式提取stderr和stdout
      if (typeof data.observation === 'string') {
        // 提取stderr内容
        const stderrMatch = data.observation.match(/stderr:([\s\S]*?)(?=stdout:|$)/);
        if (stderrMatch && stderrMatch[1] && stderrMatch[1].trim()) {
          const stderrContent = stderrMatch[1].trim();
          console.log('[Terminal处理] 添加标准错误:', stderrContent.substring(0, 100) + (stderrContent.length > 100 ? '...' : ''));
          updateAppContent('terminal', {
            type: 'stderr',
            content: stderrContent
          });
        }
        
        // 提取stdout内容
        const stdoutMatch = data.observation.match(/stdout:([\s\S]*?)(?=stderr:|$)/);
        if (stdoutMatch && stdoutMatch[1] && stdoutMatch[1].trim()) {
          const stdoutContent = stdoutMatch[1].trim();
          console.log('[Terminal处理] 添加标准输出:', stdoutContent.substring(0, 100) + (stdoutContent.length > 100 ? '...' : ''));
          updateAppContent('terminal', {
            type: 'stdout',
            content: stdoutContent
          });
        }
      } 
      // 兼容旧版数据格式
      else if (typeof data.observation === 'object') {
        if (data.observation.stderr) {
          console.log('[Terminal处理] 添加标准错误:', data.observation.stderr.substring(0, 100) + (data.observation.stderr.length > 100 ? '...' : ''));
          updateAppContent('terminal', {
            type: 'stderr',
            content: data.observation.stderr
          });
        }
        if (data.observation.stdout) {
          console.log('[Terminal处理] 添加标准输出:', data.observation.stdout.substring(0, 100) + (data.observation.stdout.length > 100 ? '...' : ''));
          updateAppContent('terminal', {
            type: 'stdout',
            content: data.observation.stdout
          });
        }
      }
    } else {
      console.warn('[Terminal处理] 未识别的数据格式:', data);
    }
  };
  
  // 处理Browser数据
  const processBrowserData = (data: any) => {
    console.log('[Browser处理] 接收到数据:', data);
    
    if (data.site) {
      console.log('[Browser处理] 添加网站:', data.site);
      updateAppContent('browser', {
        type: 'site',
        content: data.site
      });
    } else {
      console.warn('[Browser处理] 未识别的数据格式:', data);
    }
  };
  
  // 处理File数据
  const processFileData = (data: any) => {
    console.log('[File处理] 接收到数据:', data);
    
    if (data.file_path && data.content) {
      const fileName = data.file_path.split('/').pop() || '';
      console.log(`[File处理] 添加文件: ${fileName}, 路径: ${data.file_path}`);
      console.log(`[File处理] 文件内容长度: ${data.content.length} 字符`);
      
      updateAppContent('file', {
        type: 'filename',
        content: fileName,
        filePath: data.file_path,
        fileContent: data.content
      });
    } else if (data.observation) {
      console.log('[File处理] 添加提示:', data.observation);
      updateAppContent('file', {
        type: 'toast',
        content: data.observation
      });
    } else {
      console.warn('[File处理] 未识别的数据格式:', data);
    }
  };
  
  // 处理DrawIO数据
  const processDrawIOData = (data: any) => {
    console.log('[DrawIO处理] 接收到数据:', data);
    
    if (data.url) {
      console.log('[DrawIO处理] 添加URL:', data.url);
      updateAppContent('drawio', {
        type: 'fileurl',
        content: data.url
      });
    } else {
      console.warn('[DrawIO处理] 未识别的数据格式:', data);
    }
  };
  
  // 处理Output数据
  const processOutputData = (data: any) => {
    console.log('[Output处理] 接收到数据:', data);
    
    if (data.output) {
      const type = data.output.toLowerCase().includes('error') ? 'error' : 'info';
      console.log(`[Output处理] 添加${type === 'error' ? '错误' : '信息'}: ${data.output} `);
      
      updateAppContent('output', {
        type,
        content: data.output,
        timestamp: Date.now()
      });
    } else if(data.finish_reason){
      const type = 'info';
      console.log('[Output处理] 添加结束原因:', data.finish_reason);

      updateAppContent('output', {
        type,
        content: data.finish_reason,
        timestamp: Date.now()
      });
    }
    else {
      console.warn('[Output处理] 未识别的数据格式:', data);
    }
  };
  
  // 更新应用内容
  const updateAppContent = (appName: string, content: any) => {
    console.log(`[更新应用] ${appName} 添加内容:`, content);
    
    setAppWindows(prev => {
      const prevContent = prev[appName] || [];
      return {
        ...prev,
        [appName]: [...prevContent, content]
      };
    });
    
    console.log(`[更新应用] ${appName} 更新完成`);
  };
  
  return (
    <Container>
      <Header>
        <Slogan>Tell Meow Your Task</Slogan>
      </Header>
      
      <Main>
        <Screen 
          key="main-screen"
          power={power}
          appWindows={appWindows}
          activeApps={activeApps}
          onToggleApp={handleToggleApp}
          onCloseApp={handleCloseApp}
          isWorking={isWorking}
        />
        {power === 'off' && !isBooting && (
          <PowerOn key="power-on" onPowerOn={handlePowerOn} />
        )}
      </Main>
    </Container>
  );
}
