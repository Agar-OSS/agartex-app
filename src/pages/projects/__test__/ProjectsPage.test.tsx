import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProjectsPage from '../ProjectsPage';
import { UserContext } from 'context/UserContextProvider';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

const mockUser = {
  userId: 'mockUserId',
  email: 'mockEmail'
};
const mockLogout = jest.fn();

const renderInMockContext = () => {
  return render(
    <UserContext.Provider value={{
      user: mockUser,
      setUser: jest.fn(),
      logout: mockLogout
    }}>
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    </UserContext.Provider>
  );
};

describe('<ProjectsPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with all its children', () => {
    const { getByTestId } = renderInMockContext();
    getByTestId('create-new-project-button');
    getByTestId('projects-page-user-box');
  });

  it('should display create project modal on create project button click', async () => {
    const { getByTestId, queryByTestId } = renderInMockContext();
    getByTestId('create-new-project-button').click();
    await waitFor(() => expect(queryByTestId('create-project-name-text-input')).not.toBe(null));
  });

  it('should display user email in user box', () => {
    const { getByText } = renderInMockContext();
    getByText('mockEmail');
  });
  
  it('should call logout callback from user context on logout button click', () => {
    const { getByTestId } = renderInMockContext();
    getByTestId('user-box-logout-button').click();
    expect(mockLogout).toHaveBeenCalled();
  });
});
