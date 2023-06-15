import { useMemo, useState } from 'react';
import { Project } from '@model';
import { ProjectTile } from './project-tile/ProjectTile';
import styles from './ProjectsList.module.less';

interface Props {
  projects: Project[],
  filter: string
}

const ProjectsList = (props: Props) => {
  const [queryResult, setQueryResult] = useState<Project[]>([]);

  useMemo(() => {
    setQueryResult(props.projects.filter((project: Project) => {
      const pattern = props.filter.toLocaleLowerCase();
      const text = project.name.toLocaleLowerCase();
      let it = 0;
      for(let i=0; i<text.length; i++)
        if(it < pattern.length && text[i] === pattern[it])
          it++;
      return it === pattern.length;
    }));
  }, [props.filter, props.projects]);

  return (
    <div className={styles.tilesContainer}>
      {
        queryResult.length == 0
          ? <label className={styles.noProjectMessage}>No projects found</label>
          : queryResult.map((proj) => (
            <ProjectTile key={proj.name} project={proj} />
          ))
      }
    </div>
  );
};

export { ProjectsList };
