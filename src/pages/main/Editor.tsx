import { EDITOR_DELIMITER_WIDTH, EDITOR_MIN_PERCENTAGE_WORKSPACE_WIDTH } from '@constants';
import { LatexTextArea, LoadingOverlay, LoadingSpinner, PdfViewer } from '@components';
import { ReactNode, useEffect, useState } from 'react';
import Delimiter from './delimiter/Delimiter';
import { OperationState } from '@model';
import styles from './Editor.module.less';
import { useResizeDetector } from 'react-resize-detector';

interface Props {
  compilationError: string,
  compilationLogs: string,
  compilationState: OperationState,
  documentUrl: string,
  documentSource: string,
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

  useEffect(() => {
    console.log(width, height);
  }, [width, height]);

  const onDrag = (x: number) => {
    setDelimiterX(x);
  };

  const getPreviewComponent = (): ReactNode => {
    if (props.compilationState !== OperationState.ERROR) {
      return (
        <LoadingOverlay
          show={props.compilationState === OperationState.LOADING}
          loadingIndicator={
            <LoadingSpinner 
              ariaLabel='preview loading spinner' 
              testId='preview-loading-spinner'/>
          }>
          <PdfViewer
            documentUrl={props.documentUrl}
            width={pdfViewerWidth}
            height={height}
            testId='pdf-viewer'/>
        </LoadingOverlay>
      );
    } else {
      return (
        <div className={styles.errorBox}>
          <div>
            { props.compilationError }
          </div>
          <div>
            { props.compilationLogs }
          </div>
        </div>
      );
    }
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.editor}
        style={{ 
          height: height,
          width: latexTextAreaWidth 
        }}>
        <LatexTextArea
          testId='latex-text-area'
          text={props.documentSource}
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
        { getPreviewComponent() }
      </div>
    </div>
  );
};

export default Editor;
