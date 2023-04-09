
import { Link } from 'react-router-dom';
import { Project } from '@constants';
import styles from './ProjectTile.module.less';

interface Props {
  project: Project
}

const ProjectTile = (props: Props) => {
  return (
    <div className={styles.projectTileContainer}>
      <Link to={'/' + props.project.projectId} >
        { props.project.name }
      </Link>
      <div className={styles.secondaryInfoContainer}>
        <label> Created date: { props.project.createdDate } </label>
        <label> Last modified: { props.project.lastModifiedDate } </label>
        <label> contributors: { props.project.contributorsCount } </label>
        <label> owner: { props.project.owner } </label>
      </div>
    </div>
  );
};

export { ProjectTile };
