import { Project, Resource } from '@model';
import { act, render, waitFor } from '@testing-library/react';

import { ProjectContext } from 'context/ProjectContextProvider';
import userEvent from '@testing-library/user-event';

const validFile = new File([], 'valid.jpg', { type: 'image/jpg' });

const mockCreateResource = jest.fn(() => new Promise<string>(jest.fn()));
const mockUploadResourceFile = jest.fn(() => new Promise<string>(jest.fn()));
const mockFetchResourceList = jest.fn(() => new Promise<Resource[]>(jest.fn()));
jest.mock('../../service/resource-service', () => ({
  createResource: mockCreateResource,
  uploadResourceFile: mockUploadResourceFile,
  fetchResourceList: mockFetchResourceList
}));

import Toolbar from '../Toolbar';

const mockProject: Project = {
  projectId: '',
  name: '',
  created: 0,
  modified: 0,
  owner: ''
};
const mockToogleTheme = jest.fn();

const renderToolbar = () => {
  return render(
    <ProjectContext.Provider value={{
      project: mockProject,
      setProject: jest.fn(),
      documentUrl: '',
      setDocumentUrl: jest.fn()
    }}>
      <Toolbar toogleTheme={mockToogleTheme} />
    </ProjectContext.Provider>
  );
};

describe('<ProjectsPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with all its children', () => {
    const { getByTestId } = renderToolbar();
    getByTestId('collapse-toolbar-button');
    getByTestId('download-pdf-button');
    getByTestId('change-theme-button');
    getByTestId('upload-resource-button');
    getByTestId('refresh-resource-list-button');
    getByTestId('resource-list');
    expect(mockFetchResourceList).toHaveBeenCalled();
  });

  it('should hide refresh and upload button on collapse button click', () => {
    const { getByTestId, queryByTestId } = renderToolbar();
    
    act(() => {
      getByTestId('collapse-toolbar-button').click();
    });

    expect(queryByTestId('upload-resource-button')).toBeNull();
    expect(queryByTestId('refresh-resource-list-button')).toBeNull();
  });

  it('should call refresh callback on refresh list button click', () => {
    const { getByTestId } = renderToolbar();

    act(() => {
      getByTestId('refresh-resource-list-button').click();
    });

    expect(mockFetchResourceList).toHaveBeenCalled();
  });

  it('should upload a file and call refresh callback on create resource', async () => {
    const { getByTestId } = renderToolbar();

    act(() => {
      getByTestId('upload-resource-button').click();
    });

    await act(async () => {
      const fileInput = getByTestId('upload-resource-file-input');
      await userEvent.upload(fileInput, validFile);
      getByTestId('upload-resource-modal-submit-button').click();
    });

    waitFor(() => {
      expect(mockCreateResource).toHaveBeenCalledWith('valid.jpg');
      expect(mockUploadResourceFile).toHaveBeenCalled();
      expect(mockFetchResourceList).toHaveBeenCalled();
    });
  });

  it('should call toogle theme callback on toggle button click', () => {
    const { getByTestId } = renderToolbar();

    act(() => {
      getByTestId('change-theme-button').click();
    });
    
    expect(mockToogleTheme).toHaveBeenCalled();
  });
});
