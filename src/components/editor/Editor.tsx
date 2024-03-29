import { EDITOR_DELIMITER_WIDTH, EDITOR_MIN_PERCENTAGE_WORKSPACE_WIDTH } from '@constants';
import { LoadingOverlay, LoadingSpinner, PdfViewer } from '@components';
import { useContext, useState } from 'react';

import { Collaboration } from 'pages/main/collaboration/collaboration';
import Delimiter from './delimiter/Delimiter';
import LatexTextArea from './latex-textarea/LatexTextArea';
import { OperationState } from '@model';
import { ProjectContext } from 'context/ProjectContextProvider';
import Toolbar from 'pages/main/toolbar/Toolbar';
import styles from './Editor.module.less';
import { useResizeDetector } from 'react-resize-detector';

interface Props {
  collaboration: Collaboration,
  compilationError: string,
  compilationLogs: string,
  compilationState: OperationState,
  onTextChangeCompilationCallback: (text: string) => void
}

const Editor = (props: Props) => {
  const { documentUrl } = useContext(ProjectContext);

  const { width, height, ref: rootRef } = useResizeDetector();
  const { width: toolbarWidth, ref: toolbarRef } = useResizeDetector();
  const [ delimiterX, setDelimiterX ] = useState(0.5);

  const leftPaneWidth = `${100*delimiterX}%`;
  const latexTextAreaWidth = (width ?? 0) * delimiterX - (toolbarWidth ?? 0);

  const pdfViewerWidth = `calc(${100*(1 - delimiterX)}% - ${EDITOR_DELIMITER_WIDTH}px)`;
  const pdfViewerWidthValue = (width ?? 0) * (1 - delimiterX) - EDITOR_DELIMITER_WIDTH;

  const [ isLightTheme, setIsLightTheme ] = useState<boolean>(true);

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
          documentUrl={documentUrl}
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
          width: leftPaneWidth,
          height: height
        }}>
        <Toolbar
          ref={toolbarRef}
          toogleTheme={() => { setIsLightTheme(isLightTheme => !isLightTheme); }}
        />
        <div className={styles.latexTextAreaWrapper}>
          <LatexTextArea
            testId='latex-text-area'
            theme={isLightTheme ? 'vs-light' : 'vs-dark'}
            width={latexTextAreaWidth}
            onTextChangeCompilationCallback={props.onTextChangeCompilationCallback}
            collaboration={props.collaboration}
          />
        </div>
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

