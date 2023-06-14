import { Button, LoadingOverlay, LoadingSpinner } from '@components';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdRefresh } from 'react-icons/md';
import { OperationState, Resource } from '@model';
import { useEffect, useState } from 'react';

import ResourceList from './resource-list/ResourceList';
import { fetchResourceList } from './service/resource-service';
import styles from './Toolbar.module.less';

const Toolbar = () => {
  const [ listStatus, setListStatus ] = useState<OperationState>(OperationState.SUCCESS);
  
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

  useEffect(() => {
    refreshResourceList();
  }, []);

  return (
    <>
      <div
        className={styles.toolbar}
        data-testid='toolbar'>
        <Button
          className={styles.toolbarButton}
          ariaLabel='collapse toolbar button'
          onClick={() => setToolbarCollapsed(!toolbarCollapsed)}
          testId='collapse-toolbar-button'
        >
          { 
            toolbarCollapsed
              ? <MdOutlineArrowForwardIos size={24} />
              : <MdOutlineArrowBackIos size={24} />
          }
        </Button>
        { !toolbarCollapsed && 
          <Button
            className={styles.toolbarButton}
            ariaLabel='refresh resource list button'
            onClick={refreshResourceList}
            testId='refresh-resource-list-button'
          >
            <MdRefresh size={24} />
          </Button>
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
          resourceList={resourceList}
          collapsed={toolbarCollapsed}
        />
      </LoadingOverlay>
    </>
  );
};

export default Toolbar;
