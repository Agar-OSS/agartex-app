import axios, { AxiosResponse } from 'axios';
import { AGARTEX_SERVICE_COMPILATION_URL } from '@constants';

export const compileDocument = (
  projectId: string,
  documentSource: string
): Promise<AxiosResponse> => {
  return axios.post(
    AGARTEX_SERVICE_COMPILATION_URL(projectId),
    documentSource, 
    { 
      headers: {
        'Content-Type': 'text/plain'
      },
      responseType: 'blob'
    });
};
