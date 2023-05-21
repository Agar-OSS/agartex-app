import { INIT_COLLAB_STATE, Message, ParsedData } from './model';
import { useEffect, useReducer } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { AGARTEX_COLLABORATION_URL } from '@constants';
import { cloneDeep } from 'lodash';
import { collabReducer } from './reducer';

const convert_record_map = (record: Record<string, string | null>): Map<string, string | null> => {
  const map = new Map();
  Array.from(Object.entries(record)).forEach(([key, val]) => {
    map.set(key, val);
  });
  return map;
};

const convert_parsedData_message = (data: ParsedData): Message => {
  if (data.cursorsCollabPositions) {
    return {
      ...data,
      cursorsCollabPositions: convert_record_map(data.cursorsCollabPositions)
    } as Message;
  }
  return data as Message;
};

let lastSentMessageId = -1;

export const useCollaboration = () => {
  const [state, dispatch] = useReducer(collabReducer, INIT_COLLAB_STATE);
  
  const { 
    sendMessage: send, 
    lastMessage, 
    readyState: connectionState 
  } = useWebSocket(AGARTEX_COLLABORATION_URL);

  const handleIncomingMessage = (data: string) => {
    const parsedData = JSON.parse(data);
    const message = convert_parsedData_message(parsedData);
    dispatch({ message });
  };

  const sendMessage = (message: Message) => {
    // TODO: Otherwise we should not even be here in the code.
    if (connectionState === ReadyState.OPEN) {
      send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    lastMessage && handleIncomingMessage(lastMessage.data);
  }, [lastMessage]);

  useEffect(() => {
    const _messagesToSend = cloneDeep(state.messagesToSend); 

    let nextToSendIndex = _messagesToSend
      .findIndex(([id, _]) => id === lastSentMessageId) + 1;
    
    if (nextToSendIndex < _messagesToSend.length) {
      dispatch({
        name: 'popMessages',
        count: _messagesToSend.length - nextToSendIndex
      });

      while (nextToSendIndex < _messagesToSend.length) {
        const [id, message] = _messagesToSend.at(nextToSendIndex);
        sendMessage(message);
        lastSentMessageId = id;
        ++nextToSendIndex;
      }
    }
  }, [state]);
  
  // TODO: Dispatch queueing. Next dispatch should only start after the previous change has been applied.
  //       NOT AFTER THE PREVIOUS DISPATCH HAS FINISHED. This is not the case now and it can be observed
  const onDocumentSourceChange = (newSource: string) => {
    dispatch({
      name: 'localDocumentSourceChange',
      newSource
    });
  }; 

  const onCursorPositionChange = (offset: number) => {
    dispatch({
      name: 'localCursorMove',
      offset
    });
  };
  
  return {
    connectionState,
    clientId: state.clientId,
    clientsConnected: state.clientsConnected,
    documentSource: state.documentSource,
    onDocumentSourceChange,
    cursorsPositions: state.cursorsPositions,
    onCursorPositionChange
  };
};

