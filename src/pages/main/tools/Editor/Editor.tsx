import Draggable, {DraggableData} from 'react-draggable';
import { LatexTextArea, PdfViewer } from '@components';

import styles from './Editor.module.less';
import { useResizeDetector } from 'react-resize-detector';
import { useState } from 'react';

const Editor = () => {
  const DELIMITER_WIDTH = 15;
  const MIN_PERCENTAGE_WIDTH = 0.3;

  // Handle initial delimiter position
  const { width, height, ref: rootRef } = useResizeDetector();
  const [defaultDelimiterX, setDefaultDelimiterX] = useState(0.5);

  const onStop = (_: DragEvent, data: DraggableData) => {
    setDefaultDelimiterX(data.x / width);
  };

  const Delimiter = () => {
    return (
      <Draggable 
        axis='x'
        offsetParent={rootRef.current}
        defaultPosition={{ x: defaultDelimiterX * width, y: 0 }}
        bounds={{
          left: MIN_PERCENTAGE_WIDTH * width,
          right: (1 - MIN_PERCENTAGE_WIDTH) * width - DELIMITER_WIDTH
        }}
        onStop={onStop}>
        <div
          className={styles.delimiter}
          style={{ height: height, width: DELIMITER_WIDTH }}/>
      </Draggable>
    );
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.editor}>
        <LatexTextArea/>
      </div>
      <Delimiter/>
      <div className={styles.viewer}>
        <PdfViewer/>
      </div>
    </div>
  );
};

export default Editor;
