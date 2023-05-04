import { AiFillFolder, AiFillTool } from 'react-icons/ai';
import { OperationState, READY_STATE_DESCRIPTION } from '@model';
import { useContext, useEffect, useState } from 'react';
import { AGARTEX_COLLABORATION_URL  } from '@constants';
import { Button } from '@components';
import Editor from './Editor';
import { UserContext } from 'context/UserContextProvider';
import { compileDocument } from './service/compilation-service';
import styles from './Main.module.less';
import { useKeyDown } from 'util/keyboard/keyboard';
import useWebSocket from 'react-use-websocket';

const MainPage = () => {
  const { user, logout } = useContext(UserContext);

  const [documentSource, setDocumentSource] = useState<string>('');
  const [documentUrl, setDocumentUrl] = useState<string>('example.pdf');
  const [compilationError, setCompilationError] = useState<string>('');
  const [compilationLogs, setCompilationLogs] = useState<string>('');
  const [compilationState, setCompilationState] = useState<OperationState>(OperationState.SUCCESS);

  /* TODO: Extract all websocket logic to custom hook. Probably in PR with protocol logic. */
  const { sendMessage, lastMessage, readyState } = useWebSocket(AGARTEX_COLLABORATION_URL);

  /* Counting clients connected just for fun. */
  const [clientsConnected, setClientsConnected] = useState<number>(1);

  const handleNewMessage = (data: string) => {
    /* TODO: This will be a better protocol:) Perhaps jsons. */
    if (data.indexOf('[HELLO]') === 0) {
      setClientsConnected(Number(data.substring(8)) + 1);
    } else if (data.indexOf('[CONNECTED]') === 0) {
      setClientsConnected(clientsConnected + 1);
    } else if (data.indexOf('[CLOSED]') === 0) {
      setClientsConnected(clientsConnected - 1);
    } else {
      setDocumentSource(data);
    }
  };

  useEffect(() => {
    lastMessage && handleNewMessage(lastMessage.data);
  }, [lastMessage]);

  const onDocumentSourceChange = (newSource: string) => {
    sendMessage(newSource);
    setDocumentSource(newSource);
  };

  const onLogoutClick = () => {
    logout();
  };

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
        
        <span>Clients connected: {clientsConnected}</span>

        <span>WebSocket status: {readyState && READY_STATE_DESCRIPTION[readyState]}</span>

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
            compilationState={compilationState}
            compilationError={compilationError}
            compilationLogs={compilationLogs}
            documentUrl={documentUrl}
            documentSource={documentSource}
            onDocumentSourceChange={onDocumentSourceChange}
          />
        </div>
      </div>
    </div>
  );  
};

export default MainPage;
