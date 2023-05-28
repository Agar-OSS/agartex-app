import { Character, CollabReducerActionType } from '../reducer/model';
import { CollabReducerAction, CollabState, Message, MessageType, SourceChange_Message } from '../reducer/model';
import { useEffect, useRef, useState } from 'react';
import { cloneDeep } from 'lodash';

export interface Delta {
  position: string | null,
  isBackspace: boolean,
  char?: Character
}

export interface DeltaQueue {
  version: number,
  push: (delta: Delta) => void,
  pop: () => Delta
}

export const useDeltaQueue = (
  state: CollabState, 
  dispatch: (action: CollabReducerAction) => void,
  sendMessage: (message: Message) => void
): DeltaQueue => {
  const [version, setVersion] = useState<number>(0);
  
  const insertedIds = useRef<Set<string>>(new Set());
  const deletedIds = useRef<Set<string>>(new Set());

  const isDeltaApplied = (delta: Delta): boolean => {
    return (delta.isBackspace && deletedIds.current.has(delta.position)) 
      || (!delta.isBackspace && insertedIds.current.has(delta.char.id));
  };

  useEffect(() => {
    if (state.deltaQueue.length === 0) {
      return;
    } else {
      const delta = state.deltaQueue.at(0);
      if (!isDeltaApplied(delta)) {
        setVersion(version => version + 1);
      }
    }
  }, [state.deltaQueue]);

  const push = (delta: Delta) => {
    const message: SourceChange_Message = {
      type: MessageType.SOURCE_CHANGE,
      ...delta
    };
    
    dispatch({ 
      type: CollabReducerActionType.SOURCE_CHANGE,
      message
    });
    
    sendMessage(message);
  };

  const pop = (): Delta | undefined => {
    if (state.deltaQueue.length === 0) {
      return undefined;
    }

    const delta: Delta = cloneDeep(state.deltaQueue.at(0));
    
    if (isDeltaApplied(delta)) { 
      return undefined;
    }

    if (delta.isBackspace) {
      deletedIds.current.add(delta.position);
    } else {
      insertedIds.current.add(delta.char.id);
    }

    dispatch({ 
      type: CollabReducerActionType.POP_DELTA_QUEUE,
    });

    return delta;
  };

  return { version, push, pop };
};

