import { Button, LoadingOverlay, LoadingSpinner } from '@components';
import { MdAdd, MdDownload, MdModeNight, MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdRefresh } from 'react-icons/md';
import { ModalState, OperationState, Resource } from '@model';
import { createResource, fetchResourceList, uploadResourceFile } from '../service/resource-service';
import { forwardRef, useContext, useEffect, useState } from 'react';

import { ProjectContext } from 'context/ProjectContextProvider';
import ResourceList from './resource-list/ResourceList';
import UploadResourceModal from './resource-list/upload-resource-modal/UploadResourceModal';
import styles from './Toolbar.module.less';

interface Props {
  toogleTheme: () => void
}

const Toolbar = forwardRef<HTMLDivElement, Props>(function Toolbar(props, ref?) {
  const { project, documentUrl } = useContext(ProjectContext);

  const [ listStatus, setListStatus ] = useState<OperationState>(OperationState.SUCCESS);
  const [ uploadResourceModalState, setUploadResourceModalState ] = useState<ModalState>(ModalState.CLOSED);
  
  const [ toolbarCollapsed, setToolbarCollapsed ] = useState<boolean>(false);
  const [ resourceList, setResourceList ] = useState<Resource[]>([]);
  
  const refreshResourceList = () => {
    if(listStatus === OperationState.LOADING)
      return;

    setListStatus(OperationState.LOADING);
    // TODO: fix project id
    fetchResourceList()
      .then(list => {
        setResourceList(list);
        setListStatus(OperationState.SUCCESS);
      })
      .catch(error => {
        // TODO: Actuall error handling
        console.log(error);
        setListStatus(OperationState.ERROR);
      });
  };

  
  const uploadResource = (resourceName: string, resourceFile: File) => {
    if(uploadResourceModalState === ModalState.LOADING)
      return;

    setUploadResourceModalState(ModalState.LOADING);
    // TODO: fix project id
    createResource(project.projectId, resourceName)
      .then(resourceId => {
        uploadResourceFile(project.projectId, resourceId, resourceFile);
      })
      .then(() => {
        refreshResourceList();
        setUploadResourceModalState(ModalState.CLOSED);
      })
      .catch(error => {
        // TODO: Actuall error handling
        console.log(error);
        setUploadResourceModalState(ModalState.INPUT);
      });
  };

  useEffect(() => {
    refreshResourceList();
  }, []);

  return (
    <div ref={ref} className={styles.toolbarContainer}>
      <div
        className={styles.toolbar}
        data-testid='toolbar'>
        <Button
          className={styles.toolbarButton}
          ariaLabel='collapse toolbar button'
          onClick={() => setToolbarCollapsed(toolbarCollapsed => !toolbarCollapsed)}
          testId='collapse-toolbar-button'
        >
          { 
            toolbarCollapsed
              ? <MdOutlineArrowForwardIos size={24} />
              : <MdOutlineArrowBackIos size={24} />
          }
        </Button>
        <Button
          className={styles.toolbarButton}
          ariaLabel='download pdf toolbar button'
          testId='download-pdf-button'
        >
          <a
            href={documentUrl != '' ? documentUrl : null}
            download={documentUrl != '' ? project.name+'.pdf' : null}
          >
            <MdDownload size={24} />
          </a>
        </Button>
        <Button
          className={styles.toolbarButton}
          ariaLabel='change theme toolbar button'
          onClick={props.toogleTheme}
          testId='change-theme-button'
        >
          <MdModeNight size={24} />
        </Button>
        { !toolbarCollapsed && 
          <>
            <Button
              className={styles.toolbarButton}
              ariaLabel='upload resource button'
              testId='upload-resource-button'
              onClick={() => setUploadResourceModalState(ModalState.INPUT)}
            >
              <MdAdd size={24} />
            </Button>
            <Button
              className={styles.toolbarButton}
              ariaLabel='refresh resource list button'
              onClick={refreshResourceList}
              testId='refresh-resource-list-button'
            >
              <MdRefresh size={24} />
            </Button>
          </>
        }
      </div>
      <LoadingOverlay
        show={listStatus === OperationState.LOADING}
        loadingIndicator={
          <LoadingSpinner 
            ariaLabel='resource list loading spinner' 
            testId='resource-list-loading-spinner'/>
        }
      >
        <ResourceList
          testId='resource-list'
          resourceList={resourceList}
          collapsed={toolbarCollapsed}
        />
      </LoadingOverlay>

      <UploadResourceModal
        state={uploadResourceModalState}
        setState={setUploadResourceModalState}
        onSubmit={uploadResource}
      />
    </div>
  );
});

export default Toolbar;
