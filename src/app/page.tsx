'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Screen from '@/components/Screen';
import PowerOn from '@/components/PowerOn';
import BootingScreen from '@/components/Booting';
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
  font-size: 48px;
  color: #333;
  margin-top: 20px;
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
  meta: any;
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
    fetchSSEData(repoUrl);
  };
  
  // 处理启动完成
  const handleBootComplete = () => {
    setPower('on');
    setIsBooting(false);
    setIsWorking(true);
    
    // 默认打开的
    setActiveApps(['output', 'browser']);
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
    console.log(`[SSE] 开始处理仓库: ${repoUrl}`);
    
    // 初始化应用内容
    appNames.forEach(appName => {
      console.log(`[SSE] 初始化应用 ${appName}`);
      setAppWindows(prev => ({
        ...prev,
        [appName]: []
      }));
    });
    
    // 更新browser内容为占位页面
    updateAppContent('browser', {
      type: 'site',
      content: 'welcome'
    });
    
    // 添加初始信息到output
    updateAppContent('output', {
      type: 'info',
      content: `Start to execute task`,
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
          'Accept': 'text/event-stream',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache'
          // 强制使用HTTP/1.1协议
          // 'X-HTTP-Version': 'HTTP/1.1'
        },
        body: JSON.stringify({ site: repoUrl }),
        // 明确指定不使用HTTP/2
        cache: 'no-store',
        keepalive: true,
        // 设置较长的超时时间 (30秒)
        signal: AbortSignal.timeout(3000000)
      })
      .then(response => {
        if (!response.ok) {
          console.error(`[SSE] 请求失败，状态码: ${response.status}`);
          setIsWorking(false);
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
              setIsWorking(false);
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
              content: `SSE connection error ${error.message}`,
              timestamp: Date.now()
            });
            setIsWorking(false);
          });
        }
        
        console.log('[SSE] 开始读取数据流');
        readStream();
      })
      .catch(error => {
        console.error('[SSE] 建立连接错误:', error);
        updateAppContent('output', {
          type: 'error',
          content: `Request failed ${error.message}`,
          timestamp: Date.now()
        });
        setIsWorking(false);
      });
      
    } catch (error: any) {
      console.error('[SSE] 异常:', error);
      updateAppContent('output', {
        type: 'error',
        content: `Connection error ${error.message}`,
        timestamp: Date.now()
      });
      setIsWorking(false);
    }
  };
  
  // 处理SSE数据
  const processSSEData = (data: SSEData) => {
    console.log(`[SSE处理] 开始处理数据:`, data);
    
    const { app: appName_temp, meta: metaData_temp, data: appData_tmp } = data;
    
    if (!appName_temp || !metaData_temp || !appData_tmp) {
      console.error('[SSE处理] 无效的数据格式:', data);
      return;
    }
    
    const appData = {...appData_tmp, ...metaData_temp};
    console.log(`[SSE处理] 处理 ${appName_temp} 应用的数据:`, appData);

    const app = appName_temp === 'diary' ? 'output' : appName_temp.toLowerCase();

    
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
    
    if (data.operation === 'execute') {
      console.log('[Terminal处理] 添加命令:', data.content);
      updateAppContent('terminal', {
        type: 'command',
        content: data.content
      });
    } else if (data.operation === 'observe') {
      if(data.content){
        console.log('[Terminal处理] 添加输出:', data.content.substring(0, 100) + (data.content.length > 100 ? '...' : ''));
        updateAppContent('terminal', {
          type: 'stdout',
          content: data.content
        });
      }
      if(data.error){
        console.log('[Terminal处理] 添加错误:', data.error.substring(0, 100) + (data.error.length > 100 ? '...' : ''));
        updateAppContent('terminal', {
          type: 'stderr',
          content: data.error
        });
      }
    } else {
      console.warn('[Terminal处理] 未识别的数据格式:', data);
    }
  };
  
  // 处理Browser数据
  const processBrowserData = (data: any) => {
    console.log('[Browser处理] 接收到数据:', data);
    
    if(data.operation === 'open'){
      if (data.content) {
        console.log('[Browser处理] 添加网站:', data.content);
        updateAppContent('browser', {
          type: 'site',
          content: data.content
        });
      } 
    }else {
      console.warn('[Browser处理] 未识别的数据格式:', data);
    }
  };
  
  // 处理File数据
  const processFileData = (data: any) => {
    console.log('[File处理] 接收到数据:', data);
    
    if (data.operation === 'write') {
        console.log(`[File处理] 添加写文件: ${data.file_path}`);
        
        updateAppContent('file', {
          type:  'file-name-write',
          content: data.file_path
        });

        updateAppContent('file', {
          type:  'file-info',
          content: data.content
        });
    } else if (data.operation === 'read') {
      console.log(`[File处理] 添加读文件: ${data.file_path}`);

      updateAppContent('file', {
        type:  'file-name-read',
        content: data.file_path
      });
    }else if (data.operation === 'observe') {
      console.log(`[File处理] 添加读文件: ${data.file_path}`);

      updateAppContent('file', {
        type:  'file-info',
        content: data.content
      });
    }else if (data.operation === 'upload') {
      console.log(`[File处理][转交Output处理] 添加上传文件: ${data.file_path}`);

      updateAppContent('output', {
        type:  'info',
        content: `Upload file ${data.file_path}`
      });
    } else {
      console.warn('[File处理] 未识别的数据格式:', data);
    }
  };
  
  // 处理DrawIO数据
  const processDrawIOData = (data: any) => {
    console.log('[DrawIO处理] 接收到数据:', data);
    
    if(data.operation === 'observe'){
      console.log('[DrawIO处理] 添加URL:', data.file_path);
      updateAppContent('drawio', {
        type: 'drawio-file',
        content: data.file_path
      });
    } else {
      console.warn('[DrawIO处理] 未识别的数据格式:', data);
    }
  };
  
  // 处理Output数据
  const processOutputData = (data: any) => {
    console.log('[Output处理] 接收到数据:', data);
    
    if(data.operation === 'observe'){
      if (data.content) {
        const errorKeywords = ['stop', 'error', 'exception'];
        const contentLower = data.content.toLowerCase();
        const type = errorKeywords.some(keyword => contentLower.includes(keyword)) ? 'error' : 'info';
        console.log(`[Output处理] 添加${type === 'error' ? '错误' : '信息'}: ${data.content} `);
        
        updateAppContent('output', {
          type,
          content: data.content,
          timestamp: Date.now()
        });
      }
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
        {isBooting && (
          <BootingScreen key="booting-screen" onBootComplete={handleBootComplete} />
        )}
      </Main>
    </Container>
  );
}
