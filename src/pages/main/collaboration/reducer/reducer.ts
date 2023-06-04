import {
  ClientDisconnected_Message,
  CollabReducerAction,
  CollabReducerActionType,
  CollabState,
  Connected_Message,
  CursorMove_Message,
  NewClient_Message,
  SourceChange_Message
} from './model';

import { 
  clientDisconnected_action, 
  connected_action, 
  cursorMove_action, 
  newClient_action, 
  popDeltaQueue_action, 
  sourceChange_action 
} from './actions';

export const collabReducer = (
  state: CollabState,
  action: CollabReducerAction
): CollabState => {

  switch (action.type) {
    case CollabReducerActionType.CONNECTED:
      return connected_action(state, action.message as Connected_Message);
    case CollabReducerActionType.NEW_CLIENT_CONNECTED:
      return newClient_action(state, action.message as NewClient_Message);
    case CollabReducerActionType.CLIENT_DISCONNECTED:
      return clientDisconnected_action(state, action.message as ClientDisconnected_Message);
    case CollabReducerActionType.SOURCE_CHANGE:
      return sourceChange_action(state, action.message as SourceChange_Message);
    case CollabReducerActionType.CURSOR_MOVE:
      return cursorMove_action(state, action.message as CursorMove_Message);
    case CollabReducerActionType.POP_DELTA_QUEUE:
      return popDeltaQueue_action(state);
    default:
      throw new Error('Unknown collaboration reducer action name specified: ' + action.type);
  }
};

