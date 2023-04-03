import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

const mockCreateAccountPromise = Promise.resolve('');
const mockCreateAccount = jest.fn().mockImplementation(() => mockCreateAccountPromise);
jest.mock('../service/create-account-service', () => ({
  ...jest.requireActual('../service/create-account-service'),
  createAccount: mockCreateAccount
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

import CreateAccountPage from '../CreateAccountPage';

const mockValues = {
  validEmail: 'valid@email.com',
  validPassword: '1Str0ng#P4ssw0rd@!',
};

describe('<CreateAccountPage/>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with all children', () => {
    const { getByTestId } = render(<CreateAccountPage />);
    getByTestId('create-account-agartex-logo');
    getByTestId('create-account-email-text-input');
    getByTestId('create-account-password-text-input');
    getByTestId('create-account-confirm-password-text-input');
    getByTestId('create-account-submit-button');
    getByTestId('back-to-login-button');
  });

  it('should render children with proper texts', () => {
    const { getByText, getByTestId } = render(<CreateAccountPage />);
    expect(getByTestId('create-account-email-text-input')
      .getAttribute('placeholder')).toEqual('Enter your email');
    expect(getByTestId('create-account-password-text-input')
      .getAttribute('placeholder')).toEqual('Enter your password');
    expect(getByTestId('create-account-confirm-password-text-input')
      .getAttribute('placeholder')).toEqual('Confirm your password');
    getByText('Create new account');
    getByText('Submit');
    getByText('Go back to login');
  });

  it('should call create account service on submit button click', async () => {
    const { getByTestId } = render(<CreateAccountPage />);

    await act(async () => {
      const emailTextInput = getByTestId('create-account-email-text-input');
      await userEvent.type(emailTextInput, mockValues.validEmail);
      const passwordTextInput = getByTestId('create-account-password-text-input');
      await userEvent.type(passwordTextInput, mockValues.validPassword);
      const confirmPasswordTextInput = getByTestId('create-account-confirm-password-text-input');
      await userEvent.type(confirmPasswordTextInput, mockValues.validPassword);
      getByTestId('create-account-submit-button').click();
    });
    
    expect(mockCreateAccount).toHaveBeenCalledWith({
      email: mockValues.validEmail,
      password: mockValues.validPassword
    });
  });

  it('should show loading spinner and hide or disable inputs until the promise resolves', async () => {
    mockCreateAccount.mockImplementationOnce(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 10000);
      });
    });

    const { getByTestId, queryByTestId } = render(<CreateAccountPage />);

    await act(async () => {
      const emailTextInput = getByTestId('create-account-email-text-input');
      await userEvent.type(emailTextInput, mockValues.validEmail);
      const passwordTextInput = getByTestId('create-account-password-text-input');
      await userEvent.type(passwordTextInput, mockValues.validPassword);
      const confirmPasswordTextInput = getByTestId('create-account-confirm-password-text-input');
      await userEvent.type(confirmPasswordTextInput, mockValues.validPassword);
      getByTestId('create-account-submit-button').click();
    });
    
    getByTestId('create-account-loading-spinner');
    expect(queryByTestId('create-account-email-text-input')).toBeNull();
    expect(queryByTestId('create-account-password-text-input')).toBeNull();
    expect(getByTestId('create-account-submit-button').getAttribute('disabled')).not.toBeNull();
    expect(getByTestId('back-to-login-button').getAttribute('disabled')).not.toBeNull();
  });

  it('should display the create account success box after successfull call', async () => {
    const { getByTestId, getByText } = render(<CreateAccountPage />);

    await act(async () => {
      const emailTextInput = getByTestId('create-account-email-text-input');
      await userEvent.type(emailTextInput, mockValues.validEmail);
      const passwordTextInput = getByTestId('create-account-password-text-input');
      await userEvent.type(passwordTextInput, mockValues.validPassword);
      const confirmPasswordTextInput = getByTestId('create-account-confirm-password-text-input');
      await userEvent.type(confirmPasswordTextInput, mockValues.validPassword);
      getByTestId('create-account-submit-button').click();
    });
    
    getByText('Account successfully created!');
    getByText('You can go back and sign in');
  });
});
