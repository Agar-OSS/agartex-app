import { useEffect, useState } from 'react';
import { Project } from '@model';
import { ProjectTile } from './project-tile/ProjectTile';
import { TextInput } from '@components';
import styles from './ProjectsList.module.less';

interface Props {
  projects: Project[]
}

const ProjectsList = (props: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<Project[]>([]);

  useEffect(() => {
    setQueryResult(props.projects.filter((project: Project) => project.name.indexOf(searchQuery) !== -1));
  }, [searchQuery, props.projects]);

  return (
    <div className={styles.projectsListContainer}>
      <TextInput
        className={styles.searchQueryInput}
        placeholder='Search project'
        isValid={true}
        onChange={setSearchQuery}
        ariaLabel='search project query input'
        testId='search-project-query-input'
      />

      <div className={styles.tilesContainer}>
        {
          queryResult.map((proj) => (
            <ProjectTile key={proj.name} project={proj} />
          ))
        }
      </div>
    </div>
  );
};

export { ProjectsList };
