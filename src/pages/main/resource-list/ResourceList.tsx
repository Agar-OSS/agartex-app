import styles from './ResourceList.module.less';

interface Props {
  collapsed: boolean
};

const ResourceList = (props: Props) => {
  return (
    <div
      className={`${styles.resourceListContainer} ${props.collapsed ? styles.resourceListCollapsed : ''}`}
    >
      <ul>
        <li>main.tex</li>
        <li>image.png</li>
      </ul>
    </div>
  );
};

export default ResourceList;