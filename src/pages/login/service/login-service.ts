import axios from 'axios';
import { AGARTEX_SERVICE_SESSIONS_URL } from '@constants';

interface LoginRequestBody {
  email: string,
  password: string
}

interface LoginResponseBody {
  user_id: string
}

/** Performs call to agartex-service login endpoint and returns the response promise. */
export const login = async (requestBody: LoginRequestBody): Promise<string> => {
  return (await axios.post<LoginResponseBody>(AGARTEX_SERVICE_SESSIONS_URL, requestBody)).data.user_id;
};
