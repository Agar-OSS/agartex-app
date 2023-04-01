import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { RefObject, useState } from 'react';

import { RxDotsVertical } from 'react-icons/rx';
import styles from './Delimiter.module.less';

interface DelimiterProps {
  view: {
    ref: RefObject<HTMLElement>,
    width: number,
    height: number
  },
  viewMinPercentageWorkspaceWidth: number,
  delimiterWidth: number,
  onDrag: ( x: number ) => void,
  testId: string
}

const Delimiter = (props: DelimiterProps) => {
  const [ positionRatio, setPositionRatio ] = useState(0.5);

  const position = {
    x: positionRatio * props.view.width - props.delimiterWidth/2,
    y: 0
  };
  const bounds = {
    left: props.viewMinPercentageWorkspaceWidth * props.view.width,
    right: (1 - props.viewMinPercentageWorkspaceWidth) * props.view.width - props.delimiterWidth
  };

  const onStop = (_: DraggableEvent, data: DraggableData) => {
    const value = data.x / props.view.width;
    setPositionRatio(value);
    props.onDrag(value);
  };

  return (
    <Draggable 
      axis='x'
      offsetParent={props.view.ref.current}
      position={position}
      bounds={bounds}
      onStop={onStop}>
      <div
        className={styles.delimiter}
        style={{ height: props.view.height, width: props.delimiterWidth }}
        data-testid={props.testId}>
        <RxDotsVertical
          size={16}
          className={styles.dragIcon}/>
      </div>
    </Draggable>
  );
};

export default Delimiter;
