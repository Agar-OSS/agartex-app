import axios from 'axios';

interface LoginRequestBody {
  email: string,
  password: string
}

const loginPath = process.env.AGARTEX_SERVICE_BASE_URL + '/sessions';

/** Performs call to agartex-service login endpoint. 
  * Returns token on success and throws error on failure */
export const login = async (requestBody: LoginRequestBody): Promise<string> => {
  return await axios.post(loginPath, requestBody, {
    headers: {
      'content-type': 'text/json',
    }
  })
    .then((response) => {
      // This will likely not look lite this, it will be changed once login endpoint is implemented
      return response.data.token;
    });
};
