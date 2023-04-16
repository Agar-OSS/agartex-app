import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProjectsPage from '../ProjectsPage';

const renderProjectsPage = () => {
  return render(
    <MemoryRouter>
      <ProjectsPage />
    </MemoryRouter>
  );
};

describe('<ProjectsPage />', () => {
  it('should render with all its children', () => {
    const { getByTestId } = renderProjectsPage();
    getByTestId('create-new-project-button');
    getByTestId('projects-page-user-box');
  });

  it('should display create project modal on create project button click', async () => {
    const { getByTestId, queryByTestId } = renderProjectsPage();
    getByTestId('create-new-project-button').click();
    await waitFor(() => expect(queryByTestId('create-project-name-text-input')).not.toBe(null));
  });
});
