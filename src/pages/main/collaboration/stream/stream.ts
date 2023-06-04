import { Character, CollabReducerActionType, MessageType } from '../reducer/model';
import { CollabReducerAction, Message } from '../reducer/model';
import { useEffect, useRef } from 'react';
import { AGARTEX_COLLABORATION_URL } from '@constants';
import { ReadyState } from 'react-use-websocket';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';

export interface MessageDto {
  type: MessageType,
  clientId?: string,
  clientsConnectedIds?: string[],
  document?: Character[],
  char?: Character,
  position?: string,
  isBackspace?: boolean,
  cursorsPositions?: Record<string, string | null>
}

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

  const handleIncomingMessage = (data: string) => {
    const messageDto: MessageDto = JSON.parse(data);
    const message = convertMessageDtoToMessage(messageDto);
    const actionType: CollabReducerActionType = CollabReducerActionType[MessageType[message.type]];

    dispatch({ 
      type: actionType,
      message 
    });
  };

  const { 
    sendMessage: send, 
    lastMessage, 
    readyState: connectionState 
  } = useWebSocket(AGARTEX_COLLABORATION_URL, 
    {
      onMessage: (event: MessageEvent) => handleIncomingMessage(event.data)
    }
  );

  const connectionStateRef = useRef<ReadyState>(connectionState);

  const sendMessage = (message: Message) => {
    if (connectionStateRef.current === ReadyState.OPEN) {
      send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    lastMessage && handleIncomingMessage(lastMessage.data);
  }, [lastMessage]);

  return { connectionState, sendMessage };
};

