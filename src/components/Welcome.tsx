import { styled } from 'styled-components';

const PageWrapper = styled.div`
  width:600px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const ContentContainer = styled.div`
  max-width: 700px;
  width: 100%;
  background: white;
  padding: 10px 50px;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const Title = styled.h1`
  font-size: 24px;
  color: #666;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const Section = styled.section`
  margin-bottom: 6px;
  text-align: left;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #ce6a85;
  margin-bottom: 1rem;
  border-bottom: 2px dashed #ce6a85;
  padding-bottom: 0.5rem;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 10px;
`;

const ListItem = styled.li`
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
  
  &:before {
    content: "🐾";
    margin-right: 10px;
  }
`;

const Paragraph = styled.p`
  line-height: 1.6;
  margin-bottom: 10px;
  font-size: 12px;
  color: #666;
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 40px;
  font-style: italic;
  color: #666;
`;

const PowerButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #333;
  background: white;
  color: #666;
  font-size: 48px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 40px auto 20px auto;

  &::after {
    content: "⏻";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  &:hover {
    color: #333;
    font-weight: 600;
    box-shadow: 0 6px 12px rgba(99, 102, 241, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Welcome: React.FC<{}> = ({}) =>  {
  return (
    <PageWrapper>
      <ContentContainer>
        <Title>Meow is All You Need</Title>
        
        <Section>
          <Paragraph>
            我是 Meow，你在看的是我的电脑桌面！
          </Paragraph>
          <Paragraph>
            我的电脑里只安装了这 5 个 APP，所以我目前还只擅长阅读代码仓库然后帮你画画图什么的。
          </Paragraph>
          <List>
            <ListItem>Terminal - 命令行终端</ListItem>
            <ListItem>Browser - 网页浏览器</ListItem>
            <ListItem>File Explorer - 文件浏览器</ListItem>
            <ListItem>Drawio - 绘图工具</ListItem>
            <ListItem>Diary - 日记本</ListItem>
          </List>
          <Paragraph>
            我会在电脑右下角疯狂敲击键盘！我会尽力做好的！
          </Paragraph>
        </Section>

      </ContentContainer>
    </PageWrapper>
  );
}

export default Welcome;