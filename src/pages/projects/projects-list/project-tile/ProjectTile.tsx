import { Link } from 'react-router-dom';
import { Project } from '@model';
import { ProjectContext } from 'context/ProjectContextProvider';
import TimeAgo from 'react-timeago';
import styles from './ProjectTile.module.less';
import { useContext } from 'react';

interface Props {
  project: Project
}

const ProjectTile = (props: Props) => {
  const { setProject, setDocumentUrl: setPdfUrl } = useContext(ProjectContext);

  const onOpenProject = () => {
    setProject(props.project);
    setPdfUrl('');
  };

  return (
    <div className={styles.projectTileContainer}>
      <Link to={'/' + props.project.projectId} onClick={onOpenProject}>
        { props.project.name }
      </Link>
      <div className={styles.secondaryInfoContainer}>
        <label>{props.project.owner}</label>
        <label>Modified: <TimeAgo live={false} date={props.project.modified}/></label>
      </div>
    </div>
  );
};

export { ProjectTile };
