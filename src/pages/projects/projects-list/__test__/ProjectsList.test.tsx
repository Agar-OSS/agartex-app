import { MemoryRouter } from 'react-router-dom';
import { Project } from '@model';
import { ProjectContext } from 'context/ProjectContextProvider';
import { ProjectsList } from '../ProjectsList';
import { render } from '@testing-library/react';

const mockProjects: Project[] = [
  {
    projectId: 'project1',
    name: 'Project 1A',
    created: '2020-01-01 14:40:00.000000',
    modified: '2020-01-01 14:40:00.000000',
    owner: 'maciekspinney'
  },
  {
    projectId: 'project2',
    name: 'Project 2',
    created: '2020-01-02 14:40:00.000000',
    modified: '2020-01-02 14:40:00.000000',
    owner: 'tomasz_z_mazur'
  },
  {
    projectId: 'project3',
    name: 'Project 13a',
    created: '2020-01-03 14:40:00.000000',
    modified: '2020-01-03 14:40:00.000000',
    owner: 'rybahubert'
  }
];

const renderProjectsList = (
  filter: string,
  projects: Project[]
) => {
  return render(
    <MemoryRouter>
      <ProjectContext.Provider value={{
        project: null,
        setProject: jest.fn(),
        documentUrl: null,
        setDocumentUrl: jest.fn()
      }}>
        <ProjectsList filter={filter} projects={projects} />
      </ProjectContext.Provider>
    </MemoryRouter>
  );
};

describe('<ProjectsList />', () => {
  it('should display details about projects passed in props', () => {
    const { getByText } = renderProjectsList('', mockProjects);
    getByText('Project 1A');
    getByText('Project 2');
    getByText('Project 13a');
  });

  it('should display empty list message on empty list', () => {
    const { getByText } = renderProjectsList('', []);
    getByText('No projects found');
  });

  it('should filter out not matching projects', () => {
    const { getByText, queryByText } = renderProjectsList('project 1a', mockProjects);
    getByText('Project 1A');
    expect(queryByText('Project 2')).toBeNull();
    getByText('Project 13a');
  });
});

