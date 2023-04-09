import { ModalState } from '@constants';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { CreateProjectModal } from '../CreateProjectModal';
import userEvent from '@testing-library/user-event';

const mockSetState = jest.fn();
const mockSubmit = jest.fn();

const validProjectName = 'ProjectName1';

const renderModal = () => {
  return render(
    <CreateProjectModal
      state={ModalState.INPUT}
      setState={mockSetState}
      onSubmit={mockSubmit} />
  );
};

describe('<CreateProjectModal />', () => {
  it('should render with all its children', () => {
    const { getByTestId } = renderModal();
    getByTestId('create-project-name-text-input');
    getByTestId('create-project-modal-close-button');
    getByTestId('create-project-modal-submit-button');
  });

  it('should render with proper texts', () => {
    const { getByTestId, getByText } = renderModal();
    getByText('Create new project');
    getByText('Close');
    getByText('Create project');
    expect(getByTestId('create-project-name-text-input')
      .getAttribute('placeholder')).toEqual('Enter project name');
  });

  it('should close itself on close button in the footer click', () => {
    const { getByTestId } = renderModal();
    getByTestId('create-project-modal-close-button').click();
    expect(mockSetState).toHaveBeenCalledWith(ModalState.CLOSED);
  });

  it('should submit project with proper name creation on submit button click', async () => {
    const { getByTestId } = renderModal();
    await act(async () => {
      const projectNameTextInput = getByTestId('create-project-name-text-input');
      await userEvent.type(projectNameTextInput, validProjectName);
      getByTestId('create-project-modal-submit-button').click();
    });
    expect(mockSubmit).toHaveBeenCalledWith(validProjectName);
  });
});
