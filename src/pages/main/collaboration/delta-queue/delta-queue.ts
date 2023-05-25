import { CollabReducerAction, CollabState, Delta, DeltaQueue, Message, MessageType, SourceChange_Message } from '../model';
import { useEffect, useRef, useState } from 'react';
import { cloneDeep } from 'lodash';

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
    
    dispatch({ message });
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

    dispatch({ name: 'popDeltaQueue', popCount: 1 });

    return delta;
  };

  return { version, push, pop };
};

