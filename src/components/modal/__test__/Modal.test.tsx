import { ModalState } from '@model';
import Modal from '../Modal';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockSetState = jest.fn();
const mockModalHeader = <div data-testid='modal-header' />;
const mockModalBody = <div data-testid='modal-body' />;
const mockModalFooter = <div data-testid='modal-footer' />;

const renderModal = (state: ModalState = ModalState.INPUT) => {
  return render(
    <Modal
      ariaLabel='modal'
      state={state}
      setState={mockSetState}
      header={mockModalHeader}
      body={mockModalBody}
      footer={mockModalFooter}
    />
  );
};

describe('<Modal />', () => {
  it('should render with proper children and header', () => {
    const { getByTestId } = renderModal();
    getByTestId('modal-header');
    getByTestId('modal-body');
    getByTestId('modal-footer');
  });

  it('should close itself on close button click, the one in the header', () => {
    const { getByTestId } = renderModal();
    getByTestId('modal-close-button').click();
    expect(mockSetState).toHaveBeenCalledWith(ModalState.CLOSED);
  });

  it('should close itself on escape button press', async () => {
    renderModal();
    await act(async () => {
      await userEvent.keyboard('Escape');
    });
    expect(mockSetState).toHaveBeenCalledWith(ModalState.CLOSED);
  });

  it('should hide body and show loading spinner in loading state', () => {
    const { getByTestId, queryByTestId } = renderModal(ModalState.LOADING);
    getByTestId('modal-loading-spinner');
    expect(queryByTestId('modal-body')).toBe(null);
  });
});
