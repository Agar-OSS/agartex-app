import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';

import { Button } from '@components';
import { Resource } from '@model';
import ResourceList from './resource-list/ResourceList';
import styles from './Toolbar.module.less';
import { useState } from 'react';

const mockResourceList: Resource[] = [
  {
    projectId: '0',
    resourceId: '0',
    name: 'main.tex'
  },
  {
    projectId: '0',
    resourceId: '1',
    name: 'image_1.png'
  },
  {
    projectId: '0',
    resourceId: '2',
    name: 'image_2.png'
  }
];

const Toolbar = () => {
  const [ toolbarCollapsed, setToolbarCollapsed ] = useState<boolean>(false);
  const [ resourceList, setResourceList ] = useState<Resource[]>(mockResourceList);
  
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
      <ResourceList
        resourceList={resourceList}
        collapsed={toolbarCollapsed}
      />
    </>
  );
};

export default Toolbar;
