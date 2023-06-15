import { ModalState } from '@model';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import UploadResourceModal from '../UploadResourceModal';
import userEvent from '@testing-library/user-event';

const mockSetState = jest.fn();
const mockSubmit = jest.fn(() => new Promise<void>(jest.fn()));

const validFile = new File([''], 'test.png', { type: 'image/png' });

const renderModal = () => {
  return render(
    <UploadResourceModal
      state={ModalState.INPUT}
      setState={mockSetState}
      onSubmit={mockSubmit} />
  );
};

describe('<UploadResourceModal />', () => {
  it('should render with all its children', () => {
    const { getByTestId } = renderModal();
    getByTestId('upload-resource-file-input');
    getByTestId('upload-resource-modal-close-button');
    getByTestId('upload-resource-modal-submit-button');
  });

  it('should render with proper texts', () => {
    const { getByTestId, getByText } = renderModal();
    getByText('Upload image');
    getByText('Close');
    getByText('Upload');
    getByTestId('upload-resource-file-input');
  });

  it('should close itself on close button in the footer click', () => {
    const { getByTestId } = renderModal();
    getByTestId('upload-resource-modal-close-button').click();
    expect(mockSetState).toHaveBeenCalledWith(ModalState.CLOSED);
  });

  it('should upload resource with proper file on submit button click', async () => {
    const { getByTestId } = renderModal();

    await act(async () => {
      const uploadResourceFileInput = getByTestId('upload-resource-file-input');
      await userEvent.upload(uploadResourceFileInput, validFile);
      getByTestId('upload-resource-modal-submit-button').click();
    });

    expect(mockSubmit).toHaveBeenCalledWith('test.png', validFile);
  });
});
