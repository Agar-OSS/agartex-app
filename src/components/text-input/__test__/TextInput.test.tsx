import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('../../../util/validators/string-validator', () => ({
  ...jest.requireActual('../service/login-service'),
  validateString: jest.fn().mockImplementation(() => true)
}));

import TextInput from '../TextInput';

const renderTextInput = (
  onChange: (string) => void = jest.fn(),
  isValid = true
) => {
  return render(
    <TextInput
      initialValue='initial-value'
      placeholder='text-input-placeholder'
      type='text'
      onChange={onChange}
      isValid={isValid}
      errorMessage='error-message'
      ariaLabel='text-input-aria-label'
      testId='text-input'
    />
  );
};

describe('<TextInput/>', () => {
  it('should render input field with proper attributes', () => {
    const { getByTestId } = renderTextInput();
    const input = getByTestId('text-input');
    expect(input.getAttribute('value')).toBe('initial-value');
    expect(input.getAttribute('placeholder')).toBe('text-input-placeholder');
    expect(input.getAttribute('type')).toBe('text');
    expect(input.getAttribute('aria-label')).toBe('text-input-aria-label');
  });

  it('should show error message if isValid is false', () => {
    const { getByText } = renderTextInput(jest.fn(), false);
    getByText('error-message');
  });

  it('should call onChange passed in props', async () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = renderTextInput(mockOnChange, true);
    const input = getByTestId('text-input');
    await userEvent.type(input, 'abc');
    expect(mockOnChange).toHaveBeenCalled();
  });
});
