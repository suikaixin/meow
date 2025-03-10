import { 
  FaTerminal, 
  FaGlobe, 
  FaFolder, 
  FaProjectDiagram, 
  FaFileAlt 
} from 'react-icons/fa';
import { IconType } from 'react-icons';

export type ContentType = 'command' | 'stderr' | 'stdout' | 'site' | 'filename' | 'toast' | 'fileurl' | 'info' | 'error';

export interface AppConfig {
  name: string;
  icon: IconType;
  contentTypes: ContentType[];
}

export const appConfigs: Record<string, AppConfig> = {
  terminal: {
    name: 'Terminal',
    icon: FaTerminal,
    contentTypes: ['command', 'stderr', 'stdout']
  },
  browser: {
    name: 'Browser',
    icon: FaGlobe,
    contentTypes: ['site']
  },
  file: {
    name: 'File',
    icon: FaFolder,
    contentTypes: ['filename', 'toast']
  },
  drawio: {
    name: 'DrawIO',
    icon: FaProjectDiagram,
    contentTypes: ['fileurl']
  },
  output: {
    name: 'Diary',
    icon: FaFileAlt,
    contentTypes: ['info', 'error']
  }
};

export const appNames = Object.keys(appConfigs); 