import { Resource } from '@model';
import ResourceTile from './resource-tile/ResourceTile';
import styles from './ResourceList.module.less';
import { useState } from 'react';

interface Props {
  resourceList: Resource[],
  collapsed: boolean,
  testId: string
}

const ResourceList = (props: Props) => {
  const [ selectedResourceId, setSelectedResourceId ] = useState<string>('');

  return (
    <div
      data-testid={props.testId}
      className={`${styles.resourceListContainer} ${props.collapsed ? styles.resourceListCollapsed : ''}`}
    >
      {
        props.resourceList.map((resource) => (
          <ResourceTile
            key={resource.resourceId}
            resource={resource}
            selected={selectedResourceId === resource.resourceId}
            onClick={() => setSelectedResourceId(resource.resourceId)}
          />
        ))
      }
    </div>
  );
};

export default ResourceList;
