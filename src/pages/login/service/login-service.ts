import axios, { AxiosResponse } from 'axios';
import { AGARTEX_SERVICE_SESSIONS_URL } from '@constants';

interface LoginRequestBody {
  email: string,
  password: string
}

/** Performs call to agartex-service login endpoint and returns the response promise. */
export const login = async (requestBody: LoginRequestBody): Promise<AxiosResponse> => {
  return await axios.post(AGARTEX_SERVICE_SESSIONS_URL, requestBody);
};
