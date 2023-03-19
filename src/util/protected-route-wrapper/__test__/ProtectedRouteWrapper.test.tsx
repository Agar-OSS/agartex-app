import { render } from '@testing-library/react';

const mockValidateUserToken = jest.fn();
jest.mock('../service/protected-route-wrapper-service', () => ({
  ...jest.requireActual('../service/protected-route-wrapper-service'),
  validateUserToken: mockValidateUserToken
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

import ProtectedRouteWrapper from '../ProtectedRouteWrapper';

describe('ProtectedRouteWrapper', () => {

  const MockChild = () => (
    <div data-testid='protected-page' />
  );
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children if token passes validation', () => {
    mockValidateUserToken.mockReturnValue(true);

    const { getByTestId } = render(
      <ProtectedRouteWrapper>
        <MockChild />
      </ProtectedRouteWrapper>
    );
    
    expect(getByTestId('protected-page')).toBeVisible();
  });

  it('should navigate to login page if token does not pass validation', () => {
    mockValidateUserToken.mockReturnValue(false);

    const { queryByTestId } = render(
      <ProtectedRouteWrapper>
        <MockChild />
      </ProtectedRouteWrapper>
    );
    
    expect(queryByTestId('protected-page')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
