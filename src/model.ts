export enum OperationState {
  INPUT, LOADING, SUCCESS
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
