import { Button, LoadingOverlay, LoadingSpinner, TextInput } from '@components';
import { ModalState, OperationState, Project } from '@model';
import { createProject, fetchProjectList } from './service/projects-service';
import { useEffect, useState } from 'react';

import CreateProjectModal from './create-project-modal/CreateProjectModal';
import { ProjectsList } from './projects-list/ProjectsList';
import { UserBox } from './user-box/UserBox';
import styles from './ProjectsPage.module.less';

const ProjectsPage = () => {
  const [ listStatus, setListStatus ] = useState<OperationState>(OperationState.SUCCESS);

  const [ projects, setProjects ] = useState<Project[]>([]);
  const [ searchQuery, setSearchQuery ] = useState<string>('');
  const [ createProjectModalState, setCreateProjectModalState ] = useState<ModalState>(ModalState.CLOSED);

  const updateProjectList = () => {
    if(listStatus === OperationState.LOADING)
      return;

    setListStatus(OperationState.LOADING);
    fetchProjectList()
      .then(list => {
        setProjects(list);
        setListStatus(OperationState.SUCCESS);
      })
      .catch(error => {
        // TODO: Actuall error handling
        console.log(error);
        setListStatus(OperationState.ERROR);
      });
  };

  useEffect(() => {
    updateProjectList();
  }, []);

  const submitProjectCreation = (newProjectName: string) => {
    createProject(newProjectName).then(() => {
      setCreateProjectModalState(ModalState.CLOSED);
    }).catch(error => {
      console.log(error);
      setCreateProjectModalState(ModalState.INPUT);
    }).then(() => updateProjectList());
  };

  return (
    <div className={styles.projectsPageContainer}>
      <div className={styles.projectsPageHeader}>
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

        <div className={styles.buttonWrapper}>
          <Button
            className={styles.createNewProjectButton}
            value='+ Create'
            ariaLabel='create new project button'
            testId='create-new-project-button'
            onClick={() => setCreateProjectModalState(ModalState.INPUT)}
          />
          <Button
            className={styles.refreshListButton}
            value='Refresh'
            ariaLabel='refresh list button'
            testId='refresh-list-button'
            onClick={() => updateProjectList()}
          />
        </div>
      </div>

      <div className={styles.projectsPageContainerBody}>
        <div className={styles.projectsPageListContainer}>
          <LoadingOverlay
            show={listStatus === OperationState.LOADING}
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
