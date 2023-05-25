import { act, render } from '@testing-library/react';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

import Editor from '../Editor';
import { OperationState } from '@model';
import { Collaboration, DeltaQueue } from 'pages/main/collaboration/model';
import { ReadyState } from 'react-use-websocket';

const mockDeltaQueue: DeltaQueue = {
  version: 0,
  push: jest.fn(),
  pop: jest.fn()
};

const mockCollaboration: Collaboration = {
  initDocument: [],
  clientId: '',
  clientsConnectedIds: [],
  cursorsPositions: new Map(),
  onCursorPositionChange: jest.fn(),
  deltaQueue: mockDeltaQueue,
  connectionState: ReadyState.OPEN,
  generateCharacter: jest.fn()
};

const renderEditor = (
  state: OperationState = OperationState.SUCCESS,
  compilationError = '',  
  compilationLogs = ''
) => {
  return render(
    <Editor
      collaboration={mockCollaboration}
      compilationLogs={compilationLogs}
      compilationError={compilationError}
      compilationState={state}
      documentSource='mock source'
      documentUrl='example.pdf'
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
