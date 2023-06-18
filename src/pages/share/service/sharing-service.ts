import { AGARTEX_SERVICE_PROJECTS_URL } from '@constants';
import axios from 'axios';

export const shareProject = async (projectId: string): Promise<string> => {
  const result = await axios.put(`${AGARTEX_SERVICE_PROJECTS_URL}/${projectId}/sharing`);
  return result.data;
};

export const useSharingToken = async (token: string): Promise<void> => {
  await axios.post(`${AGARTEX_SERVICE_PROJECTS_URL}/sharing/${token}`);
};
