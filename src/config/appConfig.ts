import { 
  FaTerminal, 
  FaChrome, 
  FaFolder, 
  FaProjectDiagram, 
  FaFolderOpen,
  FaJournalWhills
} from 'react-icons/fa';
import { IconType } from 'react-icons';

export type ContentType = 'command' | 'stderr' | 'stdout' | 'site' | 'file-name-write' | 'file-name-read' | 'file-info' | 'drawio-file' | 'info' | 'error';

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
    icon: FaChrome,
    contentTypes: ['site']
  },
  file: {
    name: 'File',
    icon: FaFolderOpen,
    contentTypes: ['file-info', 'file-name-write', 'file-name-read']
  },
  drawio: {
    name: 'DrawIO',
    icon:  FaProjectDiagram ,
    contentTypes: ['drawio-file']
  },
  output: {
    name: 'Diary',
    icon: FaJournalWhills,
    contentTypes: ['info', 'error']
  }
};

export const appNames = Object.keys(appConfigs); 