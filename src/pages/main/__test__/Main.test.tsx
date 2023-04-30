import { UserContext } from 'context/UserContextProvider';
import MainPage from '../Main';
import { render } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));
jest.mock('../Editor');

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
      <MainPage />
    </UserContext.Provider>
  );
};

describe('<MainPage/>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with all children', () => {
    const { getByTestId } = renderInMockContext();
    getByTestId('logout-button');
    getByTestId('toolbar');
    getByTestId('editor');
  });

  it('should clear user context on logout button click', () => {
    const { getByTestId } = renderInMockContext();
    getByTestId('logout-button').click();
    expect(mockLogout).toHaveBeenCalled();
  });

  it('should navigate to login page on logout button click', () => {
    const { getByTestId } = renderInMockContext();
    getByTestId('logout-button').click();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
