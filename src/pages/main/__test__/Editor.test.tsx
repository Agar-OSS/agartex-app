import { act, render } from '@testing-library/react';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

import Editor from '../Editor';
import { OperationState } from '@model';

const renderEditor = (
  state: OperationState = OperationState.SUCCESS,
  compilationError = '',  
  compilationLogs = ''
) => {
  return render(
    <Editor
      clientId=''
      compilationLogs={compilationLogs}
      compilationError={compilationError}
      compilationState={state}
      documentSource='mock source'
      documentUrl='example.pdf'
      cursorsPositions={new Map()}
      onDocumentSourceChange={jest.fn()}
      onCursorPositionChange={jest.fn()}
    />
  );
};

describe('<Editor/>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with all children', async () => {
    const { getByTestId } = await act(() => renderEditor());
    getByTestId('delimiter');
    getByTestId('pdf-viewer');
  });

  it('should show loading spinner when compilation is loading', async () => {
    const { getByTestId } = await act(() => renderEditor(OperationState.LOADING));
    getByTestId('preview-loading-spinner');
  });

  it('should display compilation error and compilation logs and hide preview', async () => {
    const { getByText, queryByTestId } = await act(() => renderEditor(
      OperationState.ERROR, 'compilation error', 'compilation logs'));
    getByText('compilation error');
    getByText('compilation logs');
    expect(queryByTestId('pdf-viewer')).toBeNull();
  });
});
