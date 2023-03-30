import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { LatexTextArea, PdfViewer } from '@components';

import { MdOutlineDragIndicator } from 'react-icons/md';
import styles from './Editor.module.less';
import { useResizeDetector } from 'react-resize-detector';
import { useState } from 'react';

const Editor = () => {
  const DELIMITER_WIDTH = 5;
  const MIN_PERCENTAGE_WIDTH = 0.3;

  // Handle initial delimiter position
  const { width, height, ref: rootRef } = useResizeDetector();
  const [defaultDelimiterX, setDefaultDelimiterX] = useState(0.5);

  const onStop = (_: DraggableEvent, data: DraggableData) => {
    setDefaultDelimiterX(data.x / width);
  };

  const Delimiter = () => {
    console.log(width, defaultDelimiterX);
    return (
      <Draggable 
        axis='x'
        offsetParent={rootRef.current}
        defaultPosition={{ x: defaultDelimiterX * width - DELIMITER_WIDTH/2, y: 0 }}
        bounds={{
          left: MIN_PERCENTAGE_WIDTH * width,
          right: (1 - MIN_PERCENTAGE_WIDTH) * width - DELIMITER_WIDTH
        }}
        onStop={onStop}
        handle={'.'+styles.dragIcon}>
        <div
          className={styles.delimiter}
          style={{ height: height, width: DELIMITER_WIDTH }}>
          <MdOutlineDragIndicator
            size={24}
            className={styles.dragIcon}/>
        </div>
      </Draggable>
    );
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.editor}
        style={{ flexBasis: width * defaultDelimiterX }}>
        <LatexTextArea/>
      </div>
      <Delimiter/>
      <div className={styles.viewer}
        style={{ flexBasis: width * (1 - defaultDelimiterX) - DELIMITER_WIDTH }}>
        <PdfViewer/>
      </div>
    </div>
  );
};

export default Editor;
