export const EDITOR_DELIMITER_WIDTH = 5;
export const EDITOR_MIN_PERCENTAGE_WORKSPACE_WIDTH = 0.3;

declare global {
  interface Window {
    env: {
      [key: string]: string
    }
  }
}

const AGARTEX_SERVICE_BASE_URL = global.window?.env?.REACT_APP_AGARTEX_SERVICE_BASE_URL ?? process.env.REACT_APP_AGARTEX_SERVICE_BASE_URL;

export const AGARTEX_SERVICE_SESSIONS_URL = AGARTEX_SERVICE_BASE_URL + '/sessions';
export const AGARTEX_SERVICE_USERS_URL = AGARTEX_SERVICE_BASE_URL + '/users';

export enum OperationState {
  INPUT, LOADING, SUCCESS
}
