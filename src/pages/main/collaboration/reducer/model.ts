import { Delta } from '../delta-queue/delta-queue';

export enum MessageType {
  CONNECTED = 0,
  NEW_CLIENT_CONNECTED = 1,
  CLIENT_DISCONNECTED = 2,
  SOURCE_CHANGE = 3,
  CURSOR_MOVE = 4,
  CLIENT_HANDSHAKE = 999
}

export interface Character {
  deleted: boolean,
  value: string,
  prevId: string | null,
  clock: number,
  id: string
}

interface Base_Message {
  type: MessageType
}

export interface Connected_Message extends Base_Message {
  initClock: number,
  document: Character[],
  clientId: string,
  clientsConnectedIds: string[],
  cursorsPositions: Map<string, string | null>
}

export interface NewClient_Message extends Base_Message {
  clientId: string
}

export interface ClientDisconnected_Message extends Base_Message {
  clientId: string
}

export interface SourceChange_Message extends Base_Message, Delta { }

export interface CursorMove_Message extends Base_Message {
  clientId: string,
  cursorPosition: string | null
}

export interface ClientHandshake_Message extends Base_Message {
  projectId: string,
  userId: string
}

export type Message = Connected_Message | NewClient_Message | ClientDisconnected_Message 
  | SourceChange_Message | CursorMove_Message | ClientHandshake_Message;

export interface CollabState {
  initClock: number,
  document: Character[],
  clientId: string,
  clientsConnectedIds: string[],
  clientsCmap: Map<string,string>,
  cursorsPositions: Map<string, string>,
  deltaQueue: Delta[]
}

export const INIT_COLLAB_STATE: CollabState = {
  initClock: 0,
  document: [],
  clientId: '',
  clientsConnectedIds: [],
  clientsCmap: new Map(),
  cursorsPositions: new Map(),
  deltaQueue: []
};

export enum CollabReducerActionType {
  CONNECTED,
  NEW_CLIENT_CONNECTED,
  CLIENT_DISCONNECTED,
  SOURCE_CHANGE,
  CURSOR_MOVE,
  POP_DELTA_QUEUE
}

export interface CollabReducerAction {
  type: CollabReducerActionType,
  message?: Message
}

