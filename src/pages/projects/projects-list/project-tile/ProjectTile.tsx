
import { Link } from 'react-router-dom';
import { Project } from '@model';
import TimeAgo from 'react-timeago';
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
        <label>Last modified: <TimeAgo date={props.project.modified}/></label>
        <label>Owner: { props.project.owner } </label>
      </div>
    </div>
  );
};

export { ProjectTile };
