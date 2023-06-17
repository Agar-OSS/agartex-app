export const EDITOR_DELIMITER_WIDTH = 5;
export const EDITOR_MIN_PERCENTAGE_WORKSPACE_WIDTH = 0.3;

declare global {
  interface Window {
    env: {
      [key: string]: string
    }
  }
}

const SERVICE_URL = global.window?.env?.REACT_APP_SERVICE_URL ?? process.env.REACT_APP_SERVICE_URL;
const COLLABORATION_URL = global.window?.env?.REACT_APP_COLLABORATION_SERVICE_URL ?? process.env.REACT_APP_COLLABORATION_SERVICE_URL;

export const AGARTEX_SERVICE_COMPILATION_URL = SERVICE_URL + '/compile';
export const AGARTEX_SERVICE_PROJECTS_URL = SERVICE_URL + '/projects';
export const AGARTEX_SERVICE_SESSIONS_URL = SERVICE_URL + '/sessions';
export const AGARTEX_SERVICE_USERS_URL = SERVICE_URL + '/users';
export const AGARTEX_COLLABORATION_URL = COLLABORATION_URL + '/collaboration';

/* This matches the @blue2 in variables.module.less. */
export const BLUE_2 = '#7F98B8';

export const USER_STORAGE_KEY = 'agartex-user';
export const PROJECT_STORAGE_KEY = 'agartex-project';
