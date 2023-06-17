import Alert from '../Alert';
import { render } from '@testing-library/react';

const renderModal = (visible: boolean) => {
  return render(
    <Alert visible={visible}>
      <div data-testid='mock-alert-body' />
    </Alert>
  );
};

describe('<Modal />', () => {
  it('should render with proper children', () => {
    const { getByTestId } = renderModal(true);
    getByTestId('mock-alert-body');
  });

  it('should hide body and show loading spinner in loading state', () => {
    const { queryByTestId } = renderModal(false);
    expect(queryByTestId('mock-alert-body')).toBe(null);
  });
});
