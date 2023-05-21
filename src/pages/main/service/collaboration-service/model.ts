export interface Character {
  deleted: boolean,
  value: string,
  id: string
}

export enum MessageType {
  CONNECTED = 0,
  NEW_CLIENT_CONNECTED = 1,
  CLIENT_DISCONNECTED = 2,
  INSERT = 3,
  DELETE = 4,
  CURSOR_MOVE = 5
}

export interface ParsedData {
  type?: MessageType,
  clientId?: string,
  clientIds?: string[],
  collabSource?: Character[],
  chars?: Character[],
  prevId?: string,
  charIds?: string[],
  cursorsCollabPositions?: Record<string, string | null>
}

interface Base_Message {
  type: MessageType
}

export interface Connected_Message extends Base_Message {
  collabSource: Character[],
  clientId: string,
  clientIds: string[],
  cursorsCollabPositions: Map<string, string | null>
}

export interface NewClient_Message extends Base_Message {
  clientId: string
}

export interface ClientDisconnected_Message extends Base_Message {
  clientId: string
}

export interface Insert_Message extends Base_Message {
  chars: Character[],
  prevId: string | null
}

export interface Delete_Message extends Base_Message {
  charIds: string[]
}

export interface CursorMove_Message extends Base_Message {
  clientId: string,
  cursorCollabPosition: string | null
}

export type Message = Connected_Message | NewClient_Message | ClientDisconnected_Message 
  | Insert_Message | Delete_Message | CursorMove_Message;

export interface CollabState {
  collabSource: Character[],
  documentSource: string,
  clientId: string,
  clientsConnected: string[],
  cursorsCollabPositions: Map<string, string>,
  cursorsPositions: Map<string, number>,
  messagesToSend: [number, Message][],
  nextCharacterId: number,
  nextMessageId: number
}

export const INIT_COLLAB_STATE = {
  collabSource: [],
  documentSource: '',
  clientId: '',
  clientsConnected: [],
  cursorsCollabPositions: new Map(),
  cursorsPositions: new Map(),
  messagesToSend: [],
  nextCharacterId: 0,
  nextMessageId: 0
};
