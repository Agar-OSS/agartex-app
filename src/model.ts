export enum OperationState {
  ERROR, INPUT, LOADING, SUCCESS
}

export enum ModalState { 
  CLOSED, INPUT, LOADING
}

export interface Project {
  projectId: string,
  name: string,
  created: number,
  modified: number,
  owner: string
}

export interface Resource {
  projectId: string,
  resourceId: string,
  name: string
}

export interface User {
  userId: string,
  email: string
}

export interface UserContextType {
  user: User,
  setUser: (user: User) => void,
  logout: () => void
}

export interface ProjectContextType {
  project: Project,
  setProject: (project: Project) => void,
  
  documentUrl: string,
  setDocumentUrl: (url: string) => void
}
