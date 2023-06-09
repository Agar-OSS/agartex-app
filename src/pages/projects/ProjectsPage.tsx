import { Button, TextInput } from '@components';
import { ModalState, Project } from '@model';

import CreateProjectModal from './create-project-modal/CreateProjectModal';
import { ProjectsList } from './projects-list/ProjectsList';
import { UserBox } from './user-box/UserBox';
import styles from './ProjectsPage.module.less';
import { useState } from 'react';
import { createProject, fetchProjectList } from './service/projects-service';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [createProjectModalState, setCreateProjectModalState] = useState<ModalState>(ModalState.CLOSED);

  fetchProjectList().then(list => setProjects(list));

  const submitProjectCreation = async (newProjectName: string): Promise<void> => {
    await createProject(newProjectName);
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
