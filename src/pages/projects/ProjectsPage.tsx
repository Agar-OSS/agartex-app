import { ModalState, Project } from '@model';
import { useContext, useState } from 'react';
import { Button } from '@components';
import CreateProjectModal from './create-project-modal/CreateProjectModal';
import { ProjectsList } from './projects-list/ProjectsList';
import { UserBox } from './user-box/UserBox';
import { UserContext } from 'context/UserContextProvider';
import styles from './ProjectsPage.module.less';

const initProjects: Project[] = [
  {
    projectId: 'project1',
    name: 'Project 1',
    created: 1682920800,
    modified: Date.now() - 60*1000,
    owner: 'agarcoder'
  },
  {
    projectId: 'project2',
    name: 'Project 2',
    created: 1267426800,
    modified: 1267426800,
    owner: 'tomasz_z_mazur'
  },
  {
    projectId: 'project3',
    name: 'Project 3',
    created: 1241157600,
    modified: 1241157600,
    owner: 'rybahubert'
  }
];

const ProjectsPage = () => {
  const { logout } = useContext(UserContext);

  const [projects, setProjects] = useState<Project[]>(initProjects);
  const [createProjectModalState, setCreateProjectModalState] = useState<ModalState>(ModalState.CLOSED);

  const submitProjectCreation = (newProjectName: string) => {
    setProjects([...projects, {
      projectId: `id_${newProjectName}`,
      name: newProjectName,
      created: Date.now(),
      modified: Date.now(),
      owner: 'you:)'
    }]);
  };

  const onLogoutClick = () => {
    logout();
  };

  return (
    <div className={styles.projectsPageContainer}>
      <Button
        className={styles.createNewProjectButton}
        value='+ Create new project'
        ariaLabel='create new project button'
        testId='create-new-project-button'
        onClick={() => setCreateProjectModalState(ModalState.INPUT)}
      />

      <ProjectsList projects={projects} />

      <UserBox 
        onLogoutButtonClick={onLogoutClick}
      />

      <CreateProjectModal
        state={createProjectModalState}
        setState={setCreateProjectModalState}
        onSubmit={submitProjectCreation}
      />
    </div>
  );
};

export default ProjectsPage;
