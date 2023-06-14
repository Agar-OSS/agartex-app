import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';

import { Button, LoadingOverlay, LoadingSpinner } from '@components';
import { OperationState, Resource } from '@model';
import ResourceList from './resource-list/ResourceList';
import styles from './Toolbar.module.less';
import { useEffect, useState } from 'react';
import { fetchResourceList } from './service/resource-service';

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
          className={styles.collapseToolbarButton}
          ariaLabel='collapse toolbar button'
          onClick={() => setToolbarCollapsed(!toolbarCollapsed)}
          testId='collapse-toolbar-button'
        >
          { 
            toolbarCollapsed
              ? <MdOutlineArrowForwardIos className={styles.openToolbar} size={24}/>
              : <MdOutlineArrowBackIos className={styles.openToolbar} size={24}/>
          }
        </Button>
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
