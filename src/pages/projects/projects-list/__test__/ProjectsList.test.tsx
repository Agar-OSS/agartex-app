import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectsList } from '../ProjectsList';

const mockProjects = [
  {
    projectId: 'project1',
    name: 'Project 1',
    createdDate: '2013-23-54T06:23:12Z',
    lastModifiedDate: '2064-32-13T23:23:31Z',
    contributorsCount: 5,
    owner: 'maciekspinney'
  },
  {
    projectId: 'project2',
    name: 'Project 2',
    createdDate: '3134-64-12T45:23:54Z',
    lastModifiedDate: '5433-23-43T54:34:12Z',
    contributorsCount: 1,
    owner: 'tomasz_z_mazur'
  },
  {
    projectId: 'project3',
    name: 'Project 3',
    createdDate: '3213-44-23T65:12:54Z',
    lastModifiedDate: '999-32-54T21:32:32Z',
    contributorsCount: 69,
    owner: 'rybahubert'
  }
];

const renderProjectsList = () => {
  return render(
    <MemoryRouter>
      <ProjectsList projects={mockProjects} />
    </MemoryRouter>
  );
};

describe('<ProjectsList />', () => {
  it('should display details about projects passed in props', () => {
    const { getByText } = renderProjectsList();
    getByText('Project 1');
    getByText('Project 2');
    getByText('Project 3');
  });

  /* TODO: Add tests for projects search, when we decide what algorithm we should use for string matching. */
});

