import { render, waitFor } from '@testing-library/react';
import { UserContext } from 'context/UserContextProvider';
import { useContext } from 'react';

const mockStoredValue = {
  userId: 'mock_userId',
  email: 'mock_email'
};
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

import UserProvider from 'context/UserContextProvider';

const UserConsumer = () => {
  const { user, setUser, logout } = useContext(UserContext);

  return (
    <>
      <p>{user?.userId}</p>
      <p>{user?.email}</p>
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
    const { getByTestId, queryByText } = renderConsumerWithUserContext();
    getByTestId('logout-button').click();
    waitFor(() => expect(queryByText('mock_userId')).toBeNull());
    waitFor(() => expect(queryByText('mock_email')).toBeNull());
  });
});
