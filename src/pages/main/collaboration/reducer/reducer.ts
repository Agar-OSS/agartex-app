import { 
  ClientDisconnected_Message,
  CollabReducerAction,
  CollabState,
  Connected_Message,
  CursorMove_Message,
  MessageType,
  NewClient_Message,
  SourceChange_Message,
} from '../model';
import { cloneDeep } from 'lodash';

const connected_action = (state: CollabState, message: Connected_Message): CollabState => {
  return {
    ...state,
    document: message.document,
    clientId: message.clientId,
    clientsConnectedIds: message.clientsConnectedIds,
    cursorsPositions: message.cursorsPositions
  };
};

const newClient_action = (state: CollabState, message: NewClient_Message): CollabState => {
  const cursorsPositions = new Map(state.cursorsPositions);
  cursorsPositions.set(message.clientId, null);

  return {
    ...state,
    clientsConnectedIds: [ ...state.clientsConnectedIds, message.clientId ],
    cursorsPositions
  };
};

const clientDisconnected_action = (state: CollabState, message: ClientDisconnected_Message): CollabState => {
  const cursorsPositions = new Map(state.cursorsPositions);
  cursorsPositions.delete(message.clientId);
  
  return {
    ...state,
    clientsConnectedIds: 
      state.clientsConnectedIds
        .filter((clientId: string) => clientId !== message.clientId),
    cursorsPositions
  };
};

const sourceChange_action = (state: CollabState, message: SourceChange_Message): CollabState => {
  return {
    ...state,
    deltaQueue: [ ...state.deltaQueue, { ...message } ]
  };
};

const popDeltaQueue_action = (state: CollabState, popCount: number): CollabState => {
  const deltaQueue = cloneDeep(state.deltaQueue);
  deltaQueue.splice(0, popCount);

  return {
    ...state,
    deltaQueue
  };
};

const cursorMove_action = (state: CollabState, message: CursorMove_Message): CollabState => {
  const cursorsPositions = new Map(state.cursorsPositions);
  cursorsPositions.set(message.clientId, message.cursorPosition);

  return {
    ...state,
    cursorsPositions
  };
};

const messageTypeToActionName = new Map([
  [ MessageType.CONNECTED, 'connected' ],
  [ MessageType.NEW_CLIENT_CONNECTED, 'newClient'],
  [ MessageType.CLIENT_DISCONNECTED, 'clientDisconnected'],
  [ MessageType.SOURCE_CHANGE, 'sourceChange' ],
  [ MessageType.CURSOR_MOVE, 'cursorMove' ]
]);

export const collabReducer = (
  state: CollabState,
  action: CollabReducerAction
): CollabState => {

  // TODO: We should not even create the Main view until we have clientId. 
  //   so even before the editor is show. Before merge: make github issue for this!
  const actionName = action.name ?? messageTypeToActionName.get(action.message.type);

  switch (actionName) {
    case 'connected':
      return connected_action(state, action.message as Connected_Message);
    case 'newClient':
      return newClient_action(state, action.message as NewClient_Message);
    case 'clientDisconnected':
      return clientDisconnected_action(state, action.message as ClientDisconnected_Message);
    case 'sourceChange':
      return sourceChange_action(state, action.message as SourceChange_Message);
    case 'cursorMove':
      return cursorMove_action(state, action.message as CursorMove_Message);
    case 'popDeltaQueue':
      return popDeltaQueue_action(state, action.popCount);
    default:
      throw new Error('Unknown collaboration reducer action name specified: ' + actionName);
  }
};

