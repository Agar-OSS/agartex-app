import { render, waitFor } from '@testing-library/react';
import { UserContext } from 'context/UserContextProvider';
import { useContext } from 'react';

let mockStoredValue;
const mockSetValue = jest.fn();
const mockClearValue = jest.fn();

jest.mock('util/local-storage/useLocalStorage', () => ({
  ...jest.requireActual('util/local-storage/useLocalStorage'),
  useLocalStorage: jest.fn().mockImplementation(() => ({
    storedValue: mockStoredValue, 
    setValue: mockSetValue,
    clearValue: mockClearValue
  }))
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

import UserProvider from 'context/UserContextProvider';

const UserConsumer = () => {
  const { user, setUser, logout } = useContext(UserContext);

  return (
    <>
      <p data-testid='userid-field'>{user?.userId ?? 'empty'}</p>
      <p data-testid='email-field'>{user?.email ?? 'empty'}</p>
      <button 
        data-testid='change-user-button'
        onClick={() => setUser({
          userId: 'newUserId',
          email: 'newEmail'
        })} />
      <button
        data-testid='logout-button'
        onClick={logout} />
    </>
  );
};

const renderConsumerWithUserContext = () => {
  return render(
    <UserProvider>
      <UserConsumer />
    </UserProvider>
  );
};

describe('<UserContextProvider/>', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockStoredValue = {
      userId: 'mock_userId',
      email: 'mock_email'
    };
  });

  it('should load initial user context from browser local storage', () => {
    const { getByText } = renderConsumerWithUserContext();
    getByText('mock_userId');
    getByText('mock_email');
  });

  it('should set user and save it in local storage', () => {
    const { getByTestId, queryByText} = renderConsumerWithUserContext();
    getByTestId('change-user-button').click();
    waitFor(() => expect(queryByText('newUserId')).not.toBeNull());
    waitFor(() => expect(queryByText('newEmail')).not.toBeNull());
  });

  it('should clear local storage on logout', () => {
    const { getByTestId } = renderConsumerWithUserContext();
    getByTestId('logout-button').click();
    waitFor(() => expect(getByTestId('userid-field')).toHaveTextContent('empty'));
    waitFor(() => expect(getByTestId('email-field')).toHaveTextContent('empty'));
  });

  it('should navigate to login page when user is null', () => {
    mockStoredValue = null;
    renderConsumerWithUserContext();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
