import { UserContext } from 'context/UserContextProvider';
import { render } from '@testing-library/react';

jest.mock('../Editor');

jest.mock('react-use-websocket', () => ({
  default: () => ({
    sendMessage: jest.fn(),
    lastMessage: null,
    readyState: null
  }),
  ReadyState: {}
}));

const mockUser = {
  userId: 'mockUserId',
  email: 'mockEmail'
};
const mockLogout = jest.fn();

import MainPage from '../Main';

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
