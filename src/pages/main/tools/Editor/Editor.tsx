import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { LatexTextArea, PdfViewer } from '@components';

import { RxDotsVertical } from 'react-icons/rx';
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

  interface DelimiterProps {
    testId: string
  }

  const Delimiter = (props: DelimiterProps) => {
    return (
      <Draggable 
        axis='x'
        offsetParent={rootRef.current}
        defaultPosition={{ x: defaultDelimiterX * width - DELIMITER_WIDTH/2, y: 0 }}
        bounds={{
          left: MIN_PERCENTAGE_WIDTH * width,
          right: (1 - MIN_PERCENTAGE_WIDTH) * width - DELIMITER_WIDTH
        }}
        onStop={onStop}>
        <div
          className={styles.delimiter}
          style={{ height: height, width: DELIMITER_WIDTH }}
          data-testid={props.testId}>
          <RxDotsVertical
            size={16}
            className={styles.dragIcon}/>
        </div>
      </Draggable>
    );
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.editor}
        style={{ flexBasis: (width ?? 0) * defaultDelimiterX }}>
        <LatexTextArea
          testId='latex-text-area'/>
      </div>
      <Delimiter testId='delimiter'/>
      <div className={styles.viewer}
        style={{ flexBasis: (width ?? 0) * (1 - defaultDelimiterX) - DELIMITER_WIDTH }}>
        <PdfViewer
          documentUrl='example.pdf'
          width={(width ?? 0) * (1 - defaultDelimiterX) - DELIMITER_WIDTH}
          height={height}
          testId='pdf-viewer'/>
      </div>
    </div>
  );
};

export default Editor;
