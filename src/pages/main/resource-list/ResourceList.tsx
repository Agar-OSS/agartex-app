import { useState } from 'react';
import styles from './ResourceList.module.less';
import { Resource } from '@model';
import ResourceTile from './resource-tile/ResourceTile';

interface Props {
  resourceList: Resource[],
  collapsed: boolean
};

const ResourceList = (props: Props) => {
  const [ selectedResourceId, setSelectedResourceId ] = useState<string>('');

  return (
    <div
      className={`${styles.resourceListContainer} ${props.collapsed ? styles.resourceListCollapsed : ''}`}
    >
        {
          props.resourceList.map((resource) => (
            <ResourceTile
              key={resource.resourceId}
              resource={resource}
              selected={selectedResourceId === resource.resourceId}
              onClick={() => {
                console.log('CLICK!', resource.resourceId, selectedResourceId);
                setSelectedResourceId(resource.resourceId)
              }}
            />
          ))
        }
    </div>
  );
};

export default ResourceList;