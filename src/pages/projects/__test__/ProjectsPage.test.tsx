import { act, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from 'context/UserContextProvider';
import { Project } from '@model';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

const mockCreateProject = jest.fn(() => new Promise<string>(jest.fn()));
const mockFetchProjectList = jest.fn(() => new Promise<Project[]>(jest.fn()));
jest.mock('../service/projects-service', () => ({
  createProject: mockCreateProject,
  fetchProjectList: mockFetchProjectList
}));

const mockUser = {
  userId: 'mockUserId',
  email: 'mockEmail'
};
const mockLogout = jest.fn();

import ProjectsPage from '../ProjectsPage';

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
    expect(mockFetchProjectList).toHaveBeenCalled();
  });

  it('should display create project modal on create project button click', () => {
    const { getByTestId } = renderInMockContext();

    act(() => {
      getByTestId('create-new-project-button').click();
    });

    getByTestId('create-project-name-text-input');
  });

  it('should create new project and fetch projects list', () => {
    const { getByTestId } = renderInMockContext();

    act(() => {
      getByTestId('create-new-project-button').click();
    });

    act(() => {
      fireEvent.change(getByTestId('create-project-name-text-input'), { target: { value: 'new project name' }});
      getByTestId('create-project-modal-submit-button').click();
    });

    expect(mockCreateProject).toHaveBeenCalledWith('new project name');
    expect(mockFetchProjectList).toHaveBeenCalled();
  });

  it('should display user email in user box', () => {
    const { getByText } = renderInMockContext();
    getByText('mockEmail');
  });
  
  it('should call logout callback from user context on logout button click', () => {
    const { getByTestId } = renderInMockContext();

    act(() => {
      getByTestId('user-box-logout-button').click();
    });

    expect(mockLogout).toHaveBeenCalled();
  });

  it('should call fetch callback on refresh button click', () => {
    const { getByTestId } = renderInMockContext();

    act(() => {
      getByTestId('refresh-list-button').click();
    });

    expect(mockFetchProjectList).toHaveBeenCalled();
  });
});
