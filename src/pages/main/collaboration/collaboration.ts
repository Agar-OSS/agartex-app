import { Character, CollabReducerActionType, CursorMove_Message, INIT_COLLAB_STATE, MessageType } from './reducer/model';
import { DeltaQueue, useDeltaQueue } from './delta-queue/delta-queue';
import { useEffect, useReducer, useRef } from 'react';
import { ReadyState } from 'react-use-websocket';
import { collabReducer } from './reducer/reducer';
import { useCollabStream } from './stream/stream';

export interface Collaboration {
  initDocument: Character[],
  clientId: string | null,
  clientsConnectedIds: string[],
  clientsColormap: Map<string, string>,
  cursorsPositions: Map<string, string | null>,
  onCursorPositionChange: (charId: string) => void,
  deltaQueue: DeltaQueue,
  connectionState: ReadyState,
  generateCharacter: (val: string, prevId: string) => Character | undefined
}

export const useCollaboration = (projectId: string): Collaboration => {
  const [state, dispatch] = useReducer(collabReducer, INIT_COLLAB_STATE);
  const { connectionState, sendMessage } = useCollabStream(projectId, dispatch);

  const clientIdRef = useRef<string>(null);
  clientIdRef.current = state.clientId;

  const lamportClock = useRef<number>(0);
  
  useEffect(() => {
    lamportClock.current = Math.max(lamportClock.current, state.initClock);
  }, [state.initClock]);

  const nextCharacterIdRef = useRef<number>(0);

  const handleIncomingClock = (incomingClock: number) => 
    lamportClock.current = Math.max(lamportClock.current, incomingClock);
  
  const deltaQueue = useDeltaQueue(
    clientIdRef,
    state,
    dispatch, 
    handleIncomingClock,
    sendMessage
  );

  const generateCharacter = (value: string, prevId: string): Character | undefined => {
    nextCharacterIdRef.current = nextCharacterIdRef.current + 1;
    lamportClock.current = lamportClock.current + 1;

    return {
      deleted: false,
      value,
      prevId,
      clock: lamportClock.current,
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
    clientsColormap: state.clientsColormap,
    cursorsPositions: state.cursorsPositions,
    onCursorPositionChange,
    deltaQueue,
    connectionState,
    generateCharacter
  };
};

