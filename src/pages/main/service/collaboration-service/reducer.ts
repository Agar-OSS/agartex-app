import { 
  Character,
  ClientDisconnected_Message,
  Connected_Message,
  CursorMove_Message,
  Delete_Message,
  Insert_Message,
  Message,
  MessageType,
  NewClient_Message
} from './model';
import { CollabState } from './model';
import { cloneDeep } from 'lodash';

const longestCommonPrefix = (A: string, B: string): number => {
  let result = 0;
  while (result < A.length && result < B.length && A.at(result) === B.at(result)) {
    result++;
  }
  return result;
};

const longestCommonSufix = (A: string, B: string): number => {
  let result = 0;
  while (result < A.length && result < B.length && A.at(A.length - 1 - result) === B.at(B.length - 1 - result)) {
    result++;
  }
  return result;
};

const generateCharacter = (value: string, clientId: string, id: number): Character => {    
  const newChar = {
    deleted: false,
    value,
    id: [clientId, id.toString()].join('.')
  };

  return newChar;
};

const convert_collabSource_documentSource = (collabSource: Character[]) => {
  return collabSource
    .filter((c: Character) => !c.deleted)
    .map((c: Character) => c.value)
    .join('');
};

const convert_cursorsCollabPositions_cursorPositions = (
  collabSource: Character[],
  cursorsCollabPositions: Map<string, string | null>
): Map<string, number> => {
  const cursorsPositions = new Map();
  const collabSourceWithoutDeleted = collabSource.filter((c: Character) => !c.deleted);

  cursorsCollabPositions.forEach((cursorCollabPosition: string | null, clientId: string) => {
    cursorsPositions.set(clientId, cursorCollabPosition ? 
      collabSourceWithoutDeleted.findIndex((c: Character) => c.id === cursorCollabPosition)
      : -1);
  });
  
  return cursorsPositions;
};

const connected_action = (state: CollabState, message: Connected_Message): CollabState => {
  const documentSource = convert_collabSource_documentSource(message.collabSource);
  const cursorsPositions = convert_cursorsCollabPositions_cursorPositions(message.collabSource, message.cursorsCollabPositions);
  
  return {
    ...state,
    collabSource: message.collabSource,
    clientId: message.clientId,
    clientsConnected: message.clientIds,
    cursorsCollabPositions: message.cursorsCollabPositions,
    documentSource,
    cursorsPositions
  };
};

const newClient_action = (state: CollabState, message: NewClient_Message): CollabState => {
  const cursorsCollabPositions = state.cursorsCollabPositions.set(message.clientId, null);
  const cursorsPositions = state.cursorsPositions.set(message.clientId, -1);

  return {
    ...state,
    clientsConnected: [ ...state.clientsConnected, message.clientId ],
    cursorsCollabPositions,
    cursorsPositions
  };
};

const clientDisconnected_action = (state: CollabState, message: ClientDisconnected_Message): CollabState => {
  const cursorsCollabPositions = new Map(state.cursorsCollabPositions);
  cursorsCollabPositions.delete(message.clientId);
  const cursorsPositions = new Map(state.cursorsPositions);
  cursorsPositions.delete(message.clientId);

  return {
    ...state,
    clientsConnected: state.clientsConnected
      .filter((clientId: string) => clientId !== message.clientId),
    cursorsCollabPositions,
    cursorsPositions
  };
};

const insert_action = (state: CollabState, message: Insert_Message): CollabState => {
  const insertIndex = (message.prevId) ? 
    state.collabSource
      .findIndex((char: Character) => char.id === message.prevId)
    : -1;

  const collabSource = state.collabSource;
  collabSource.splice(insertIndex + 1, 0, ...message.chars);

  const documentSource = convert_collabSource_documentSource(collabSource);

  return {
    ...state,
    collabSource,
    documentSource
  };
};

const delete_action = (state: CollabState, message: Delete_Message): CollabState => {
  const collabSource = 
    state.collabSource
      .map((char: Character) => message.charIds.includes(char.id) ? 
        { ...char, deleted: true } : char);

  const documentSource = convert_collabSource_documentSource(collabSource);

  return {
    ...state,
    collabSource,
    documentSource
  };
};

const cursorMove_action = (state: CollabState, message: CursorMove_Message): CollabState => {
  const cursorsCollabPositions = cloneDeep(state.cursorsCollabPositions);
  cursorsCollabPositions.set(message.clientId, message.cursorCollabPosition);
  const cursorsPositions = convert_cursorsCollabPositions_cursorPositions(state.collabSource, cursorsCollabPositions);

  return {
    ...state,
    cursorsCollabPositions,
    cursorsPositions
  };
};

const localDocumentSourceChange_action = (state: CollabState, newSource: string): CollabState => {
  const lcp = longestCommonPrefix(state.documentSource, newSource);
  const lcs = longestCommonSufix(
    state.documentSource.slice(lcp),
    newSource.slice(lcp)
  );
  
  let deleteMessage: Delete_Message | null = null;
  if (lcp + lcs < state.documentSource.length) {
    const charIds = 
      state.collabSource
        .filter((char: Character) => !char.deleted)
        .slice(lcp, state.documentSource.length - lcs)
        .map((char: Character) => char.id);

    deleteMessage = {
      type: MessageType.DELETE,
      charIds
    };
  }

  let _nextCharacterId = state.nextCharacterId;
  
  let insertMessage: Insert_Message | null = null;
  if (lcp + lcs < newSource.length) {
    const prevId = (lcp > 0) ? 
      state.collabSource
        .filter((char: Character) => !char.deleted)
        .at(lcp-1)
        .id
      : null;
    
    const chars = 
      newSource
        .slice(lcp, newSource.length - lcs)
        .split('')
        .map((c: string) => generateCharacter(c, state.clientId, _nextCharacterId++));

    insertMessage = {
      type: MessageType.INSERT,
      chars,
      prevId
    };
  }
  
  let _state = cloneDeep(state);
  const _messagesToSend = cloneDeep(state.messagesToSend);
  let _nextMessageId = state.nextMessageId;
  
  if (deleteMessage) {
    _state = delete_action(_state, deleteMessage);
    _messagesToSend.push([_nextMessageId, deleteMessage]);
    _nextMessageId++;
  }

  if (insertMessage) {
    _state = insert_action(_state, insertMessage);
    _messagesToSend.push([_nextMessageId, insertMessage]);
    _nextMessageId++;
  }

  return {
    ..._state,
    messagesToSend: _messagesToSend,
    nextMessageId: _nextMessageId,
    nextCharacterId: _nextCharacterId
  };
};

const localCursorMove_action = (state: CollabState, offset: number): CollabState => {
  const collabSourceWithoutDeleted = state.collabSource.filter((c: Character) => !c.deleted);
  const cursorCollabPosition = (offset !== -1) ? collabSourceWithoutDeleted
    .at(Math.min(offset, collabSourceWithoutDeleted.length-1)).id : null;
  
  const cursorMoveMessage: CursorMove_Message = {
    type: MessageType.CURSOR_MOVE,
    clientId: state.clientId,
    cursorCollabPosition
  };

  const _state = cursorMove_action(state, cursorMoveMessage);
  const _messagesToSend = cloneDeep(state.messagesToSend);
  _messagesToSend.push([state.nextMessageId, cursorMoveMessage]);
 
  return {
    ..._state,
    messagesToSend: _messagesToSend,
    nextMessageId: state.nextMessageId + 1
  };
};

const popMessages_action = (state: CollabState, count: number): CollabState => {
  return {
    ...state,
    messagesToSend: state.messagesToSend.slice(count)
  };
};

interface Action {
  name?: string,
  message?: Message,
  newSource?: string,
  offset?: number,
  count?: number
}

const messageTypeToActionName = new Map([
  [ MessageType.CONNECTED, 'connected' ],
  [ MessageType.NEW_CLIENT_CONNECTED, 'newClient'],
  [ MessageType.CLIENT_DISCONNECTED, 'clientDisconnected'],
  [ MessageType.INSERT, 'insert' ],
  [ MessageType.DELETE, 'delete' ],
  [ MessageType.CURSOR_MOVE, 'cursorMove' ]
]);

const actionsRequiringClientId = [ 'localDocumentSourceChange, localCursorMove' ];

export const collabReducer = (
  state: CollabState,
  action: Action
): CollabState => {
  const actionName = action.name ?? messageTypeToActionName.get(action.message.type);

  // TODO: We should not even create the Main view until we have clientId. 
  // so even before the editor is show. Before merge: make github issue for this!
  if (state.clientId === '' && actionsRequiringClientId.includes(actionName)) {
    return state;
  }

  switch (actionName) {
    case 'connected':
      return connected_action(state, action.message as Connected_Message);
    case 'newClient':
      return newClient_action(state, action.message as NewClient_Message);
    case 'clientDisconnected':
      return clientDisconnected_action(state, action.message as ClientDisconnected_Message);
    case 'insert':
      return insert_action(state, action.message as Insert_Message);
    case 'delete':
      return delete_action(state, action.message as Delete_Message);
    case 'cursorMove':
      return cursorMove_action(state, action.message as CursorMove_Message);
    case 'localDocumentSourceChange':
      return localDocumentSourceChange_action(state, action.newSource);
    case 'localCursorMove':
      return localCursorMove_action(state, action.offset);
    case 'popMessages':
      return popMessages_action(state, action.count);
    default:
      throw new Error('Unknown collaboration reducer action name specified: ' + actionName);
  }
};

