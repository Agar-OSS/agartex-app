import Alert from '../Alert';
import { AlertState } from '@model';
import { render } from '@testing-library/react';

const renderModal = (state: AlertState) => {
  return render(
    <Alert state={state}>
      <div data-testid='mock-alert-body' />
    </Alert>
  );
};

describe('<Modal />', () => {
  it('should render with proper children', () => {
    const { getByTestId } = renderModal(AlertState.OPEN);
    getByTestId('mock-alert-body');
  });

  it('should hide body and show loading spinner in loading state', () => {
    const { queryByTestId } = renderModal(AlertState.CLOSED);
    expect(queryByTestId('mock-alert-body')).toBe(null);
  });
});
