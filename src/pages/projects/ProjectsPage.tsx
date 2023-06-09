import { Button, LoadingOverlay, LoadingSpinner, TextInput } from '@components';
import { ModalState, Project } from '@model';

import CreateProjectModal from './create-project-modal/CreateProjectModal';
import { ProjectsList } from './projects-list/ProjectsList';
import { UserBox } from './user-box/UserBox';
import styles from './ProjectsPage.module.less';
import { useEffect, useState } from 'react';
import { createProject, fetchProjectList } from './service/projects-service';

enum ProjectsListStatus {
  LOADING, SUCCESS, ERROR
};

const ProjectsPage = () => {
  const [ listStatus, setListStatus ] = useState<ProjectsListStatus>(ProjectsListStatus.SUCCESS);

  const [ projects, setProjects ] = useState<Project[]>([]);
  const [ searchQuery, setSearchQuery ] = useState<string>('');
  const [ createProjectModalState, setCreateProjectModalState ] = useState<ModalState>(ModalState.CLOSED);

  const updateProjectList = () => {
    if(listStatus === ProjectsListStatus.LOADING)
      return;

    setListStatus(ProjectsListStatus.LOADING);
    fetchProjectList()
      .then(list => {
        setProjects(list);
        setListStatus(ProjectsListStatus.SUCCESS);
        console.log(ProjectsListStatus[listStatus]);
      })
      .catch(error => {
        // TODO: Actuall error handling
        console.log(error);
        setListStatus(ProjectsListStatus.ERROR);
      });
  };

  useEffect(() => {
    updateProjectList();
  }, []);

  const submitProjectCreation = async (newProjectName: string): Promise<void> => {
    await createProject(newProjectName).then(() => updateProjectList());
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
          <LoadingOverlay
            show={listStatus === ProjectsListStatus.LOADING}
            loadingIndicator={
              <LoadingSpinner 
                ariaLabel='preview loading spinner' 
                testId='preview-loading-spinner'/>
            }
          >
            <ProjectsList filter={searchQuery} projects={projects} />
          </LoadingOverlay>
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
