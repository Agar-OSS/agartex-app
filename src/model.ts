import { ReadyState } from 'react-use-websocket';

export enum OperationState {
  ERROR, INPUT, LOADING, SUCCESS
}

export enum ModalState { 
  CLOSED, INPUT, LOADING
}

export interface Project {
  projectId: string,
  name: string,
  createdDate: string,
  lastModifiedDate: string,
  contributorsCount: number,
  owner: string
}

export const READY_STATE_DESCRIPTION = {
  [ReadyState.CONNECTING]: 'Connecting',
  [ReadyState.OPEN]: 'Open',
  [ReadyState.CLOSING]: 'Closing',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
};

export interface User {
  userId: string,
  email: string
}

export interface UserContextType {
  user: User,
  setUser: (user: User) => void,
  logout: () => void
}
