import { Project, ProjectContextType } from '@model';
import { ReactNode, createContext, useState } from 'react';

import { PROJECT_STORAGE_KEY } from '@constants';
import { useLocalStorage } from 'util/local-storage/useLocalStorage';

interface Props {
  children: ReactNode | ReactNode[]
}

export const ProjectContext = createContext<ProjectContextType | null>(null);

const ProjectProvider = (props: Props) => {
  const [ pdfUrl, setPdfUrl ] = useState<string>('');

  const { 
    storedValue: project, 
    setValue: setProject
  } = useLocalStorage<Project>(PROJECT_STORAGE_KEY);

  return (
    <ProjectContext.Provider
      value={{ project, setProject, pdfUrl, setPdfUrl }}
    >
      { props.children }
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
