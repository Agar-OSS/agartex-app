import { ModalState, Project } from '@model';
import { Button } from '@components';
import CreateProjectModal from './create-project-modal/CreateProjectModal';
import { ProjectsList } from './projects-list/ProjectsList';
import { UserBox } from './user-box/UserBox';
import styles from './ProjectsPage.module.less';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const initProjects = [
  {
    projectId: 'project1',
    name: 'Project 1',
    createdDate: '2013-23-54T06:23:12Z',
    lastModifiedDate: '2064-32-13T23:23:31Z',
    contributorsCount: 5,
    owner: 'agarcoder'
  },
  {
    projectId: 'project2',
    name: 'Project 2',
    createdDate: '3134-64-12T45:23:54Z',
    lastModifiedDate: '5433-23-43T54:34:12Z',
    contributorsCount: 1,
    owner: 'tomasz_z_mazur'
  },
  {
    projectId: 'project3',
    name: 'Project 3',
    createdDate: '3213-44-23T65:12:54Z',
    lastModifiedDate: '999-32-54T21:32:32Z',
    contributorsCount: 10,
    owner: 'rybahubert'
  }
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>(initProjects);
  const [createProjectModalState, setCreateProjectModalState] = useState<ModalState>(ModalState.CLOSED);
  const navigate = useNavigate();

  const submitProjectCreation = (newProjectName: string) => {
    setProjects([...projects, {
      projectId: `id_${newProjectName}`,
      name: newProjectName,
      createdDate: '1111-11-11T11:11:11Z',
      lastModifiedDate: '2222-22-22T22:22:22Z',
      contributorsCount: 1,
      owner: 'you:)'
    }]);
  };

  const logout = () => {
    navigate('/login');
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
        onLogoutButtonClick={logout}
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
