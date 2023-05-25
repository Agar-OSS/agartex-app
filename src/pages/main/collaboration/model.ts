import { ReadyState } from 'react-use-websocket';

export interface Character {
  deleted: boolean,
  value: string,
  id: string
}

export enum MessageType {
  CONNECTED = 0,
  NEW_CLIENT_CONNECTED = 1,
  CLIENT_DISCONNECTED = 2,
  SOURCE_CHANGE = 3,
  CURSOR_MOVE = 4
}

export interface MessageDto {
  type?: MessageType,
  clientId?: string,
  clientsConnectedIds?: string[],
  document?: Character[],
  char?: Character,
  position?: string,
  isBackspace?: boolean,
  cursorsPositions?: Record<string, string | null>
}

export interface Delta {
  position: string | null,
  isBackspace: boolean,
  char: Character | null
}

interface Base_Message {
  type: MessageType
}

export interface Connected_Message extends Base_Message {
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

export type Message = Connected_Message | NewClient_Message | ClientDisconnected_Message 
  | SourceChange_Message | CursorMove_Message;

export interface CollabState {
  document: Character[],
  clientId: string,
  clientsConnectedIds: string[],
  cursorsPositions: Map<string, string>,
  deltaQueue: Delta[]
}

export const INIT_COLLAB_STATE = {
  document: [],
  clientId: '',
  clientsConnectedIds: [],
  cursorsPositions: new Map(),
  deltaQueue: []
};

export interface CollabReducerAction {
  name?: string,
  message?: Message,
  popCount?: number
}

export interface DeltaQueue {
  version: number,
  push: (delta: Delta) => void,
  pop: () => Delta
}

export interface Collaboration {
  initDocument: Character[],
  clientId: string | null,
  clientsConnectedIds: string[],
  cursorsPositions: Map<string, string | null>,
  onCursorPositionChange: (charId: string) => void,
  deltaQueue: DeltaQueue,
  connectionState: ReadyState,
  generateCharacter: (val: string) => Character
}

