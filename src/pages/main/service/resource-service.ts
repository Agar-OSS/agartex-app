import { AGARTEX_SERVICE_RESOURCES_URL } from '@constants';
import { Resource } from '@model';
import axios from 'axios';

interface RawResource {
  project_id: string,
  resource_id: string,
  name: string
}

/* Upload resource and return ID of new created resource */
export const createResource = async (
  projectId: string,
  resourceName: string
): Promise<string> => {
  const result = await axios.post<RawResource>(AGARTEX_SERVICE_RESOURCES_URL(projectId), { name: resourceName });
  return result.data.resource_id;
};

/* Upload resource and return ID of new created resource */
export const uploadResourceFile = async (
  projectId: string,
  resourceId: string,
  resourceFile: File
): Promise<void> => {
  await axios.put(AGARTEX_SERVICE_RESOURCES_URL(projectId) + '/' + resourceId, resourceFile);
};

/* Fetch resource list for the current user and project */
export const fetchResourceList = async (projectId: string): Promise<Resource[]> => {
  const result = await axios.get<RawResource[]>(AGARTEX_SERVICE_RESOURCES_URL(projectId));
  return result.data.map(raw => ({
    projectId: raw.project_id,
    resourceId: raw.resource_id,
    name: raw.name,
  }));
};
