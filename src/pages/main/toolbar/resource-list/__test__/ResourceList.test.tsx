import { render } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import { Resource } from '@model';
import ResourceList from '../ResourceList';

const mockResource: Resource[] = [
  {
    projectId: 'project1',
    resourceId: 'resource1',
    name: 'image1.png'
  },
  {
    projectId: 'project1',
    resourceId: 'resource2',
    name: 'image2.png'
  }
];

const renderResourceList = () => {
  return render(
    <MemoryRouter>
      <ResourceList testId='resource-list' collapsed={false} resourceList={mockResource} />
    </MemoryRouter>
  );
};

describe('<ResourceList />', () => {
  it('should display all resource names passed in props', () => {
    const { getByText } = renderResourceList();
    getByText('image1.png');
    getByText('image2.png');
  });
});

