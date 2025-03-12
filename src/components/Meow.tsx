import Image from 'next/image';
import { styled } from 'styled-components';

const MeowAvatar = styled.div<{ $isWorking: boolean }>`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 150px;
  height: 150px;
  z-index: 10;
  opacity: ${({ $isWorking }) => $isWorking ? 1 : 1};
  transition: opacity 0.3s ease;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
`;

const Meow: React.FC<{ isWorking: boolean }> = ({ isWorking }) => {
  return (
    <MeowAvatar $isWorking={isWorking}>
      <Image 
        src={isWorking ? '/images/cat-key.gif' : '/images/cat-tea.gif'} 
        alt="Meow Avatar" 
        width={130} 
        height={130}
      />
    </MeowAvatar>
  );
};

export default Meow;