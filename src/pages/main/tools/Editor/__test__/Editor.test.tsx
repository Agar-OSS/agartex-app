import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

import Editor from '../Editor';

describe('<Editor/>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with all children', async () => {
    const { getByTestId } = await act(() => { return render(<Editor/>); });
    getByTestId('latex-text-area');
    getByTestId('pdf-viewer');
  });
});
