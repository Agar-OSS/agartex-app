import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

const mockLoginPromise = Promise.resolve('');
const mockLogin = jest.fn().mockImplementation(() => mockLoginPromise);
jest.mock('../service/login-service', () => ({
  ...jest.requireActual('../service/login-service'),
  login: mockLogin
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

import LoginPage from '../LoginPage';

const mockValues = {
  validEmail: 'valid@email.com',
  validPassword: '1Str0ng#P4ssw0rd@!',
};

describe('<LoginPage/>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with all children', () => {
    const { getByTestId } = render(<LoginPage />);
    getByTestId('login-agartex-logo');
    getByTestId('login-email-text-input');
    getByTestId('login-password-text-input');
    getByTestId('login-button');
    getByTestId('create-account-button');
  });

  it('should render children with proper texts', () => {
    const { getByText, getByTestId } = render(<LoginPage />);
    expect(getByTestId('login-email-text-input')
      .getAttribute('placeholder')).toEqual('Enter your email');
    expect(getByTestId('login-password-text-input')
      .getAttribute('placeholder')).toEqual('Enter your password');
    getByText('Welcome back!');
    getByText('Sign in');
    getByText('Create account');
  });

  it('should call login service on login button click', async () => {
    const { getByTestId } = render(<LoginPage />);

    await act(async () => {
      const emailTextInput = getByTestId('login-email-text-input');
      await userEvent.type(emailTextInput, mockValues.validEmail);
      const passwordTextInput = getByTestId('login-password-text-input');
      await userEvent.type(passwordTextInput, mockValues.validPassword);
      getByTestId('login-button').click();
    });
    
    expect(mockLogin).toHaveBeenCalledWith({
      email: mockValues.validEmail,
      password: mockValues.validPassword
    });
  });

  it('should show loading spinner and hide or disable inputs until the promise resolves', async () => {
    mockLogin.mockImplementationOnce(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 10000);
      });
    });

    const { getByTestId, queryByTestId } = render(<LoginPage />);

    await act(async () => {
      const emailTextInput = getByTestId('login-email-text-input');
      await userEvent.type(emailTextInput, mockValues.validEmail);
      const passwordTextInput = getByTestId('login-password-text-input');
      await userEvent.type(passwordTextInput, mockValues.validPassword);
      getByTestId('login-button').click();
    });
    
    getByTestId('create-account-loading-spinner');
    expect(queryByTestId('login-email-text-input')).toBeNull();
    expect(queryByTestId('login-password-text-input')).toBeNull();
    expect(getByTestId('login-button').getAttribute('disabled')).not.toBeNull();
    expect(getByTestId('create-account-button').getAttribute('disabled')).not.toBeNull();
  });
});
