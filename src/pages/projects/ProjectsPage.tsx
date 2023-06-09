import { Button, TextInput } from '@components';
import { ModalState, Project } from '@model';

import CreateProjectModal from './create-project-modal/CreateProjectModal';
import { ProjectsList } from './projects-list/ProjectsList';
import { UserBox } from './user-box/UserBox';
import styles from './ProjectsPage.module.less';
import { useState } from 'react';

const initProjects: Project[] = Array(30).fill(0).map((_, index) => {
  return {
    projectId: `project_${index}`,
    name: `Project ${index}`,
    created: Date.now() - 24*60*60*1000,
    modified: Date.now() - index*60*1000,
    owner: 'rybahubert'
  };
});

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>(initProjects);
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  return (
    <div className={styles.projectsPageContainer}>
      <div className={styles.projectsPageHeader}>
        <div className={styles.createNewProjectButtonWrapper}>
          <Button
            className={styles.createNewProjectButton}
            value='+ Create new project'
            ariaLabel='create new project button'
            testId='create-new-project-button'
            onClick={() => setCreateProjectModalState(ModalState.INPUT)}
          />
        </div>

        <div className={styles.searchQueryInputWrapper}>
          <TextInput
            className={styles.searchQueryInput}
            placeholder='Search project'
            isValid={true}
            onChange={setSearchQuery}
            ariaLabel='search project query input'
            testId='search-project-query-input'
          />
        </div>
      </div>

      <div className={styles.projectsPageContainerBody}>
        <div className={styles.projectsPageListContainer}>
          <ProjectsList filter={searchQuery} projects={projects} />
        </div>
        <div className={styles.projectsPageUserBox}>
          <UserBox/>
        </div>
      </div>

      <CreateProjectModal
        state={createProjectModalState}
        setState={setCreateProjectModalState}
        onSubmit={submitProjectCreation}
      />
    </div>
  );
};

export default ProjectsPage;
