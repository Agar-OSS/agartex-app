import { Character, CollabReducerActionType } from '../reducer/model';
import { CollabReducerAction, CollabState, Message, MessageType, SourceChange_Message } from '../reducer/model';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { cloneDeep } from 'lodash';

export interface Delta {
  id: string,
  delete?: string[],
  insert?: Character[]
}

export interface DeltaQueue {
  version: number,
  push: (delta: Delta) => void,
  pop: () => Delta
}

export const useDeltaQueue = (
  clientIdRef: MutableRefObject<string>,
  state: CollabState, 
  dispatch: (action: CollabReducerAction) => void,
  handleIncomingClock: (incomingClock: number) => void,
  sendMessage: (message: Message) => void
): DeltaQueue => {
  const [version, setVersion] = useState<number>(0);

  const nextDeltaIdRef = useRef<number>(-1);
  const appliedDeltaIds = useRef<Set<string>>(new Set());

  const isDeltaApplied = (delta: Delta): boolean => {
    return appliedDeltaIds.current.has(delta.id);
  };

  const generateDeltaId = (): string => {
    nextDeltaIdRef.current = nextDeltaIdRef.current + 1;
    return [clientIdRef.current, nextDeltaIdRef.current.toString()].join('.');
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
    delta.id = generateDeltaId();

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
    
    dispatch({ 
      type: CollabReducerActionType.POP_DELTA_QUEUE,
    });
  
    if (delta.insert && delta.insert.length) {
      const maxIncomingClock = Math.max(
        ...delta.insert.map((c: Character) => c.clock));
      handleIncomingClock(maxIncomingClock);
    }

    appliedDeltaIds.current.add(delta.id);

    return delta;
  };

  return { version, push, pop };
};

