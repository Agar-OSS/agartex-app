import { EDITOR_DELIMITER_WIDTH, EDITOR_MIN_PERCENTAGE_WORKSPACE_WIDTH } from '@constants';
import { LoadingOverlay, LoadingSpinner, PdfViewer } from '@components';
import { Collaboration } from 'pages/main/collaboration/model';
import Delimiter from './delimiter/Delimiter';
import LatexTextArea from './latex-textarea/LatexTextArea';
import { OperationState } from '@model';
import styles from './Editor.module.less';
import { useResizeDetector } from 'react-resize-detector';
import { useState } from 'react';

interface Props {
  collaboration: Collaboration,
  compilationError: string,
  compilationLogs: string,
  compilationState: OperationState,
  documentUrl: string,
  onTextChangeCompilationCallback: (text: string) => void
}

const Editor = (props: Props) => {
  const { width, height, ref: rootRef } = useResizeDetector();
  const [ delimiterX, setDelimiterX ] = useState(0.5);
  const latexTextAreaWidth = `${100*delimiterX}%`;
  const pdfViewerWidth = `calc(${100*(1 - delimiterX)}% - ${EDITOR_DELIMITER_WIDTH}px)`;
  const pdfViewerWidthValue = (width ?? 0) * (1 - delimiterX) - EDITOR_DELIMITER_WIDTH;

  const onDrag = (x: number) => {
    setDelimiterX(x);
  };

  const previewComponent = 
    (props.compilationState !== OperationState.ERROR) ?
      <LoadingOverlay
        show={props.compilationState === OperationState.LOADING}
        loadingIndicator={
          <LoadingSpinner 
            ariaLabel='preview loading spinner' 
            testId='preview-loading-spinner'/>
        }>
        <PdfViewer
          documentUrl={props.documentUrl}
          width={pdfViewerWidthValue}
          height={height}
          testId='pdf-viewer'/>
      </LoadingOverlay> : 
      <div className={styles.errorBox}>
        <div>
          { props.compilationError }
        </div>
        <div>
          { props.compilationLogs }
        </div>
      </div>;

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.editor}
        style={{ 
          height: height,
          width: latexTextAreaWidth 
        }}>
        <LatexTextArea
          testId='latex-text-area'
          onTextChangeCompilationCallback={props.onTextChangeCompilationCallback}
          collaboration={props.collaboration}
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
        { previewComponent }
      </div>
    </div>
  );
};

export default Editor;

