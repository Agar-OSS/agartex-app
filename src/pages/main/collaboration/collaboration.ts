import { 
  Character,
  Collaboration,
  CursorMove_Message,
  INIT_COLLAB_STATE,
  MessageType,
} from './model';
import { useReducer, useRef } from 'react';
import { collabReducer } from './reducer/reducer';
import { useCollabStream } from './stream/stream';
import { useDeltaQueue } from './delta-queue/delta-queue';

export const useCollaboration = (): Collaboration => {
  const [state, dispatch] = useReducer(collabReducer, INIT_COLLAB_STATE);
  const { connectionState, sendMessage } = useCollabStream(dispatch);
  const deltaQueue = useDeltaQueue(state, dispatch, sendMessage);

  const nextCharacterIdRef = useRef<number>(0);

  const clientIdRef = useRef<string>(null);
  clientIdRef.current = state.clientId;

  const generateCharacter = (value: string): Character | undefined => {
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

    dispatch({ message: moveMessage });
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

