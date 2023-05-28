import { Character, CollabReducerActionType, CursorMove_Message, INIT_COLLAB_STATE, MessageType } from './reducer/model';
import { DeltaQueue, useDeltaQueue } from './delta-queue/delta-queue';
import { useReducer, useRef } from 'react';
import { ReadyState } from 'react-use-websocket';
import { collabReducer } from './reducer/reducer';
import { useCollabStream } from './stream/stream';

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

export const useCollaboration = (): Collaboration => {
  const [state, dispatch] = useReducer(collabReducer, INIT_COLLAB_STATE);
  const { connectionState, sendMessage } = useCollabStream(dispatch);
  const deltaQueue = useDeltaQueue(state, dispatch, sendMessage);

  const nextCharacterIdRef = useRef<number>(0);

  const clientIdRef = useRef<string>(null);
  clientIdRef.current = state.clientId;

  const generateCharacter = (value: string): Character | undefined => {
    if (!clientIdRef.current) { 
      return undefined;
    }

    nextCharacterIdRef.current = nextCharacterIdRef.current + 1;

    return {
      deleted: false,
      value,
      id: [clientIdRef.current, nextCharacterIdRef.current.toString()].join('.')
    };
  };

  const onCursorPositionChange = (charId: string | null) => {
    const moveMessage: CursorMove_Message = {
      type: MessageType.CURSOR_MOVE,
      clientId: clientIdRef.current,
      cursorPosition: charId
    };

    dispatch({
      type: CollabReducerActionType.CURSOR_MOVE,
      message: moveMessage
    });

    sendMessage(moveMessage);
  };
  
  return {
    initDocument: state.document,
    clientId: state.clientId,
    clientsConnectedIds: state.clientsConnectedIds,
    cursorsPositions: state.cursorsPositions,
    onCursorPositionChange,
    deltaQueue,
    connectionState,
    generateCharacter
  };
};

