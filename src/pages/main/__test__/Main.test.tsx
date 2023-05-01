import { UserContext } from 'context/UserContextProvider';
import MainPage from '../Main';
import { render } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
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

  it('should call logout callback from user context on logout button click', () => {
    const { getByTestId } = renderInMockContext();
    getByTestId('logout-button').click();
    expect(mockLogout).toHaveBeenCalled();
  });
});
