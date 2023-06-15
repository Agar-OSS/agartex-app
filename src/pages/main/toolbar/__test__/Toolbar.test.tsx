import { Resource } from '@model';
import userEvent from '@testing-library/user-event';

const validFile = new File([], 'valid.jpg', { type: 'image/jpg' });

const mockCreateResource = jest.fn(() => new Promise<string>(jest.fn()));
const mockUploadResourceFile = jest.fn(() => new Promise<string>(jest.fn()));
const mockFetchResourceList = jest.fn(() => new Promise<Resource[]>(jest.fn()));
jest.mock('../service/resource-service', () => ({
  createResource: mockCreateResource,
  uploadResourceFile: mockUploadResourceFile,
  fetchResourceList: mockFetchResourceList
}));

import Toolbar from '../Toolbar';
import { act, render, waitFor } from '@testing-library/react';

const renderToolbar = () => {
  return render(
    <Toolbar />
  );
};

describe('<ProjectsPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with all its children', () => {
    const { getByTestId } = renderToolbar();
    getByTestId('collapse-toolbar-button');
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
    getByTestId('refresh-resource-list-button').click();
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
});
