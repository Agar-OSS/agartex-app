
import { Resource } from '@model';
import styles from './ResourceTile.module.less';

interface Props {
  resource: Resource,
  selected: boolean,
  onClick: () => void
}

const Resource = (props: Props) => {
  return (
    <div
      className={`${styles.resourceTile} ${props.selected ? styles.resourceListSelected : ''}`}
      onClick={props.onClick}
    >
      <label>{props.resource.name}</label>
    </div>
  );
};

export default Resource;
