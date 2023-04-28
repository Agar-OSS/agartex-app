import { EDITOR_DELIMITER_WIDTH, EDITOR_MIN_PERCENTAGE_WORKSPACE_WIDTH } from '@constants';
import { LatexTextArea, PdfViewer } from '@components';
import { useEffect, useState } from 'react';

import Delimiter from './delimiter/Delimiter';
import styles from './Editor.module.less';
import { useResizeDetector } from 'react-resize-detector';

interface Props {
  compilationError: string | null,
  compilationLogs: string,
  documentUrl: string,
  onDocumentSourceChange: (newSource: string) => void
}

const Editor = (props: Props) => {
  const { width, height, ref: rootRef } = useResizeDetector();
  const [ delimiterX, setDelimiterX ] = useState(0.5);
  const [ latexTextAreaWidth, setlatexTextAreaWidth ] = useState(0);
  const [ pdfViewerWidth, setPdfViewerWidth ] = useState(0);

  useEffect(() => {
    setlatexTextAreaWidth((width ?? 0) * delimiterX);
    setPdfViewerWidth((width ?? 0) * (1 - delimiterX) - EDITOR_DELIMITER_WIDTH);
  }, [width, delimiterX]);

  useEffect(() => console.log(latexTextAreaWidth), [latexTextAreaWidth]);

  const onDrag = (x: number) => {
    setDelimiterX(x);
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.editor}
        style={{ width: latexTextAreaWidth }}>
        <LatexTextArea
          testId='latex-text-area'
          onTextChange={props.onDocumentSourceChange}
        />
      </div>
      <Delimiter
        view={{
          ref: rootRef,
          width: width ?? 0,
          height: height ?? 0
        }}
        viewMinPercentageWorkspaceWidth={EDITOR_MIN_PERCENTAGE_WORKSPACE_WIDTH}
        delimiterWidth={EDITOR_DELIMITER_WIDTH}
        onDrag={onDrag}
        testId='delimiter'/>
      <div 
        className={styles.viewer}
        style={{ width: pdfViewerWidth }}
      >
        {
          !props.compilationError ? 
            <PdfViewer
              documentUrl={props.documentUrl}
              width={pdfViewerWidth}
              height={height}
              testId='pdf-viewer'/> 
            : <label>{props.compilationLogs}</label>
        }
      </div>
    </div>
  );
};

export default Editor;
