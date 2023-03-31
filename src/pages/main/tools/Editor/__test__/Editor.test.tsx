import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;
// jest.mock('@components');

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
