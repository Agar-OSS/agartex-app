import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FileInput from '../FileInput';

const renderFileInput = (
  onChange: (File) => void = jest.fn(),
  isValid = true
) => {
  return render(
    <FileInput
      onChange={onChange}
      isValid={isValid}
      errorMessage='error-message'
      ariaLabel='file-input-aria-label'
      accept='image/*'
      testId='file-input'
    />
  );
};

describe('<FileInput/>', () => {
  it('should render input field with proper attributes', () => {
    const { getByTestId } = renderFileInput();
    const input = getByTestId('file-input');
    expect(input.getAttribute('type')).toBe('file');
    expect(input.getAttribute('accept')).toBe('image/*');
    expect(input.getAttribute('aria-label')).toBe('file-input-aria-label');
  });

  it('should show error message if isValid is false', () => {
    const { getByText } = renderFileInput(jest.fn(), false);
    getByText('error-message');
  });

  it('should call onChange passed in props', async () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = renderFileInput(mockOnChange, true);
    const input = getByTestId('file-input');

    const file = new File([''], 'test.png', { type: 'image/png' });
    await userEvent.upload(input, file);
    expect(mockOnChange).toHaveBeenCalled();
  });
});
