export const EDITOR_DELIMITER_WIDTH = 5;
export const EDITOR_MIN_PERCENTAGE_WORKSPACE_WIDTH = 0.3;

export const AGARTEX_SERVICE_SESSIONS_URL = process.env.AGARTEX_SERVICE_BASE_URL + '/sessions';
export const AGARTEX_SERVICE_USERS_URL = process.env.AGARTEX_SERVICE_BASE_URL + '/users';

export enum OperationState {
  INPUT, LOADING, SUCCESS
}
