import { Collaboration } from '../collaboration/collaboration';
import { DeltaQueue } from '../collaboration/delta-queue/delta-queue';
import MainPage from '../Main';
import { ReadyState } from 'react-use-websocket';
import { UserContext } from 'context/UserContextProvider';
import { render } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

jest.mock('../../../components/editor/Editor');

const mockDeltaQueue: DeltaQueue = {
  version: 0,
  push: jest.fn(),
  pop: jest.fn()
};

const mockCollaboration: Collaboration = {
  initDocument: [],
  clientId: '',
  clientsConnectedIds: [],
  cursorsPositions: new Map(),
  onCursorPositionChange: jest.fn(),
  deltaQueue: mockDeltaQueue,
  connectionState: ReadyState.OPEN,
  generateCharacter: jest.fn()
};

jest.mock('../collaboration/collaboration', () => ({
  useCollaboration: () => mockCollaboration
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
