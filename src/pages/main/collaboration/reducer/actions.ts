import {
  ClientDisconnected_Message,
  CollabState,
  Connected_Message,
  CursorMove_Message,
  NewClient_Message,
  SourceChange_Message
} from './model';

import { COLORS } from '@constants';
import { cloneDeep } from 'lodash';

export const connected_action = (state: CollabState, message: Connected_Message): CollabState => {
  const clientsColormap = new Map();
  message.clientsConnectedIds.forEach((clientId) => {
    clientsColormap.set(clientId, COLORS[clientsColormap.size % COLORS.length]);
  });

  return {
    ...state,
    initClock: message.initClock,
    document: message.document,
    clientId: message.clientId,
    clientsColormap: clientsColormap,
    clientsConnectedIds: message.clientsConnectedIds,
    cursorsPositions: message.cursorsPositions
  };
};

export const newClient_action = (state: CollabState, message: NewClient_Message): CollabState => {
  const cursorsPositions = new Map(state.cursorsPositions);
  cursorsPositions.set(message.clientId, null);

  const clientsColormap = new Map(state.clientsColormap);
  clientsColormap.set(message.clientId, COLORS[state.clientsColormap.size % COLORS.length]);

  return {
    ...state,
    clientsConnectedIds: [ ...state.clientsConnectedIds, message.clientId ],
    cursorsPositions,
    clientsColormap: clientsColormap
  };
};

export const clientDisconnected_action = (state: CollabState, message: ClientDisconnected_Message): CollabState => {
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

export const sourceChange_action = (state: CollabState, message: SourceChange_Message): CollabState => {
  return {
    ...state,
    deltaQueue: [ ...state.deltaQueue, { ...message } ]
  };
};

export const cursorMove_action = (state: CollabState, message: CursorMove_Message): CollabState => {
  const cursorsPositions = new Map(state.cursorsPositions);
  cursorsPositions.set(message.clientId, message.cursorPosition);

  return {
    ...state,
    cursorsPositions
  };
};

export const popDeltaQueue_action = (state: CollabState): CollabState => {
  const deltaQueue = cloneDeep(state.deltaQueue);
  deltaQueue.shift();

  return {
    ...state,
    deltaQueue
  };
};

