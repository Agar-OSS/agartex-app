import { Character, CollabReducerActionType } from '../reducer/model';
import { CollabReducerAction, CollabState, Message, MessageType, SourceChange_Message } from '../reducer/model';
import { useEffect, useRef, useState } from 'react';
import { cloneDeep } from 'lodash';

export interface Delta {
  delete?: string[],
  insert?: Character[]
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
    const hasUndeleted = delta.delete 
      && delta.delete.findIndex((charId: string) => !deletedIds.current.has(charId)) !== -1;
    const hasUninserted = delta.insert 
      && delta.insert.findIndex((c: Character) => !insertedIds.current.has(c.id)) !== -1;
    
    return !hasUninserted && !hasUndeleted;
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
    if (isDeltaApplied(delta)) {
      return;
    }

    console.log(JSON.stringify(delta));
    
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
    
    if (delta.delete) {
      delta.delete.forEach((charId: string) => deletedIds.current.add(charId));
    } else if (delta.insert){
      delta.insert.forEach((c: Character) => insertedIds.current.add(c.id));
    }

    dispatch({ 
      type: CollabReducerActionType.POP_DELTA_QUEUE,
    });

    return delta;
  };

  return { version, push, pop };
};

