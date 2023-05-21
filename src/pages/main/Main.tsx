import { AiFillFolder, AiFillTool } from 'react-icons/ai';
import { OperationState, READY_STATE_DESCRIPTION } from '@model';
import { useContext, useState } from 'react';
import { Button } from '@components';
import Editor from './Editor';
import { UserContext } from 'context/UserContextProvider';
import { compileDocument } from './service/compilation-service';
import styles from './Main.module.less';
import { useCollaboration } from './service/collaboration-service/collaboration-service';
import { useKeyDown } from 'util/keyboard/keyboard';

const MainPage = () => {
  const { user, logout } = useContext(UserContext);

  const [documentUrl, setDocumentUrl] = useState<string>('example.pdf');
  const [compilationError, setCompilationError] = useState<string>('');
  const [compilationLogs, setCompilationLogs] = useState<string>('');
  const [compilationState, setCompilationState] = useState<OperationState>(OperationState.SUCCESS);

  const onLogoutClick = () => {
    logout();
  };

  const {
    connectionState,
    clientId,
    clientsConnected,
    documentSource,
    cursorsPositions,
    onDocumentSourceChange,
    onCursorPositionChange
  } = useCollaboration();

  const compile = () => {
    setCompilationError('');
    setCompilationLogs('');
    setCompilationState(OperationState.LOADING);

    compileDocument(documentSource)
      .then((response) => {
        setDocumentUrl(window.URL.createObjectURL(new Blob([response.data])));
        setCompilationState(OperationState.SUCCESS);
      })
      .catch((error) => {
        setCompilationState(OperationState.ERROR);
        setCompilationError(error.message);

        console.log(error.message);

        if (error.response.status === 422) {
          error.response.data.text()
            .then((logs) => setCompilationLogs(logs));
        }
      });
  };
  
  /* Register CTRL-S event to compile document. */
  useKeyDown('s', compile, true);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        
        <span>Clients connected: {clientsConnected.join(' ')}</span>

        <span>WebSocket status: {connectionState && READY_STATE_DESCRIPTION[connectionState]}</span>

        <span>{ user?.email }</span>

        <Button
          ariaLabel='logout button'
          onClick={onLogoutClick}
          testId='logout-button'
          value='Logout'/>

        <Button 
          ariaLabel='compile button'
          onClick={compile}
          testId='compile-button'
          value='Compile'/>
      </div>
      <div className={styles.body}>
        <div
          className={styles.toolbar}
          data-testid='toolbar'>
          <AiFillFolder size={50}/>
          <AiFillTool size={50}/>
        </div>
        <div
          className={styles.editor}
          data-testid='editor'>
          <Editor
            clientId={clientId}
            compilationState={compilationState}
            compilationError={compilationError}
            compilationLogs={compilationLogs}
            documentUrl={documentUrl}
            documentSource={documentSource}
            cursorsPositions={cursorsPositions}
            onDocumentSourceChange={onDocumentSourceChange}
            onCursorPositionChange={onCursorPositionChange}
          />
        </div>
      </div>
    </div>
  );  
};

export default MainPage;
