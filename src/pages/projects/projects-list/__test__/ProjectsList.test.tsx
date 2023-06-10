import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectsList } from '../ProjectsList';
import { Project } from '@model';

const mockProjects: Project[] = [
  {
    projectId: 'project1',
    name: 'Project 1A',
    created: 1000000000,
    modified: 1000000000,
    owner: 'maciekspinney'
  },
  {
    projectId: 'project2',
    name: 'Project 2',
    created: 2000000000,
    modified: 2000000000,
    owner: 'tomasz_z_mazur'
  },
  {
    projectId: 'project3',
    name: 'Project 13a',
    created: 3000000000,
    modified: 3000000000,
    owner: 'rybahubert'
  }
];

const renderProjectsList = (
  filter: string
) => {
  return render(
    <MemoryRouter>
      <ProjectsList filter={filter} projects={mockProjects} />
    </MemoryRouter>
  );
};

describe('<ProjectsList />', () => {
  it('should display details about projects passed in props', () => {
    const { getByText } = renderProjectsList('');
    getByText('Project 1A');
    getByText('Project 2');
    getByText('Project 13a');
  });

  it('should filter out not matching projects', () => {
    const { getByText, queryByText } = renderProjectsList('project 1a');
    getByText('Project 1A');
    expect(queryByText('Project 2')).toBeNull();
    getByText('Project 13a');
  });
});

