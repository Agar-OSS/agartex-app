import axios, { AxiosResponse } from 'axios';
import { AGARTEX_SERVICE_USERS_URL } from '@constants';

interface CreateAccountRequestBody {
  email: string,
  password: string
}

/** Performs call to agartex-service register endpoint and returns the response promise. */
export const createAccount = async (requestBody: CreateAccountRequestBody): Promise<AxiosResponse> => {
  return await axios.post(AGARTEX_SERVICE_USERS_URL, requestBody);
};
