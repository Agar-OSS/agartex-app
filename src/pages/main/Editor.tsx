import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { EDITOR_DELIMITER_WIDTH, EDITOR_MIN_PERCENTAGE_WORKSPACE_WIDTH } from '@constants';
import { LatexTextArea, PdfViewer } from '@components';
import { useEffect, useState } from 'react';

import { RxDotsVertical } from 'react-icons/rx';
import styles from './Editor.module.less';
import { useResizeDetector } from 'react-resize-detector';

const Editor = () => {
  const { width, height, ref: rootRef } = useResizeDetector();
  const [ defaultDelimiterX, setDefaultDelimiterX ] = useState(0.5);
  const [ latexTextAreaWidth, setlatexTextAreaWidth ] = useState(0);
  const [ pdfViewerWidth, setPdfViewerWidth ] = useState(0);

  useEffect(() => {
    setlatexTextAreaWidth((width ?? 0) * defaultDelimiterX);
    setPdfViewerWidth((width ?? 0) * (1 - defaultDelimiterX) - EDITOR_DELIMITER_WIDTH);
  }, [width, defaultDelimiterX]);

  const onStop = (_: DraggableEvent, data: DraggableData) => {
    setDefaultDelimiterX(data.x / width);
  };

  interface DelimiterProps {
    testId: string
  }

  const Delimiter = (props: DelimiterProps) => {
    const defaultPosition = {
      x: defaultDelimiterX * width - EDITOR_DELIMITER_WIDTH/2,
      y: 0
    };
    const bounds = {
      left: EDITOR_MIN_PERCENTAGE_WORKSPACE_WIDTH * width,
      right: (1 - EDITOR_MIN_PERCENTAGE_WORKSPACE_WIDTH) * width - EDITOR_DELIMITER_WIDTH
    };

    return (
      <Draggable 
        axis='x'
        offsetParent={rootRef.current}
        defaultPosition={defaultPosition}
        bounds={bounds}
        onStop={onStop}>
        <div
          className={styles.delimiter}
          style={{ height: height, width: EDITOR_DELIMITER_WIDTH }}
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
        style={{ flexBasis: latexTextAreaWidth }}>
        <LatexTextArea
          testId='latex-text-area'/>
      </div>
      <Delimiter testId='delimiter'/>
      <div className={styles.viewer}
        style={{ flexBasis: pdfViewerWidth }}>
        <PdfViewer
          documentUrl='example.pdf'
          width={pdfViewerWidth}
          height={height}
          testId='pdf-viewer'/>
      </div>
    </div>
  );
};

export default Editor;
