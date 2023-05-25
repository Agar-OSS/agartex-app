import { CollabReducerAction, Message, MessageDto } from '../model';
import { useCallback, useEffect, useRef } from 'react';
import { AGARTEX_COLLABORATION_URL } from '@constants';
import { ReadyState } from 'react-use-websocket';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';

const convertRecordToMap = (record: Record<string, string | null>): Map<string, string | null> => {
  const map = new Map();
  Array.from(Object.entries(record)).forEach(([key, val]) => {
    map.set(key, val);
  });
  return map;
};

const convertMessageDtoToMessage = (data: MessageDto): Message => {
  if (data.cursorsPositions) {
    return {
      ...data,
      cursorsPositions: convertRecordToMap(data.cursorsPositions)
    } as Message;
  }
  return data as Message;
};

export const useCollabStream = (dispatch: (action: CollabReducerAction) => void) => {
  const { 
    sendMessage: send, 
    lastMessage, 
    readyState: connectionState 
  } = useWebSocket(AGARTEX_COLLABORATION_URL);

  const connectionStateRef = useRef<ReadyState>(null);
  connectionStateRef.current = connectionState;

  const handleIncomingMessage = (data: string) => {
    const messageDto: MessageDto = JSON.parse(data);
    const message = convertMessageDtoToMessage(messageDto);
    dispatch({ message });
  };

  const sendMessage = useCallback((message: Message) => {
    // TODO: Otherwise we should not even be here in the code.
    if (connectionStateRef.current === ReadyState.OPEN) {
      send(JSON.stringify(message));
    }
  }, [connectionState]);

  useEffect(() => {
    lastMessage && handleIncomingMessage(lastMessage.data);
  }, [lastMessage]);

  return { connectionState, sendMessage };
};

