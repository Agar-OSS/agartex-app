import { act, render } from '@testing-library/react';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

import Editor from '../Editor';
import { OperationState } from '@model';
import { ReadyState } from 'react-use-websocket';
import { DeltaQueue } from 'pages/main/collaboration/delta-queue/delta-queue';
import { Collaboration } from 'pages/main/collaboration/collaboration';
import { ProjectContext } from 'context/ProjectContextProvider';

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
    <ProjectContext.Provider value={{
      project: null,
      setProject: jest.fn(),
      documentUrl: 'example.pdf',
      setDocumentUrl: jest.fn()
    }}>
      <Editor
        collaboration={mockCollaboration}
        compilationLogs={compilationLogs}
        compilationError={compilationError}
        compilationState={state}
        onTextChangeCompilationCallback={jest.fn()}
      />
    </ProjectContext.Provider>
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

