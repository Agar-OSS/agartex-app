import { Alert, Button, Editor, LoadingSpinner } from '@components';
import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { OperationState } from '@model';
import { ProjectContext } from 'context/ProjectContextProvider';
import { ReadyState } from 'react-use-websocket';
import { RiWifiOffLine } from 'react-icons/ri';
import { Tooltip } from 'react-tooltip';
import { UserContext } from 'context/UserContextProvider';
import { compileDocument } from './service/compilation-service';
import styles from './Main.module.less';
import { useCollaboration } from './collaboration/collaboration';
import { useKeyDown } from 'util/keyboard/keyboard';

const MainPage = () => {
  const { project } = useContext(ProjectContext);

  const navigate = useNavigate();
  const { projectId } = useParams();

  const { setDocumentUrl } = useContext(ProjectContext);
  const { user, logout } = useContext(UserContext);

  const [compilationError, setCompilationError] = useState<string>('');
  const [compilationLogs, setCompilationLogs] = useState<string>('');
  const [compilationState, setCompilationState] = useState<OperationState>(OperationState.SUCCESS);

  const [text, setText] = useState<string>('');

  const collaboration = useCollaboration(projectId);

  const onCloseClick = () => {
    navigate('/');
  };

  const onLogoutClick = () => {
    logout();
  };

  const compile = () => {
    setCompilationError(null);
    setCompilationLogs('');
    setCompilationState(OperationState.LOADING);

    compileDocument(project.projectId, text)
      .then((response) => {
        setDocumentUrl(window.URL.createObjectURL(new Blob([response.data])));
        setCompilationState(OperationState.SUCCESS);
      })
      .catch((error) => {
        setCompilationError(error.message);
        setCompilationState(OperationState.ERROR);

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
    <>
      <div className={styles.root}>
        <div className={styles.header}>
          <Button
            className={styles.closeProjectButton}
            ariaLabel='close project button'
            onClick={onCloseClick}
            testId='close-project-button'
            value='Close Project'/>

          <label className={styles.projectName}>{project.name}</label>

          <span className={styles.clientsConnectedList}>
            {
              collaboration.clientsConnectedIds.map((clientId) => (
                <div key={clientId} className={styles.clientIdLabel}>
                  <div className={`${collaboration.clientsColormap.get(clientId)} ${styles.clientIdLabelBackground}`} />
                  <div className={`${collaboration.clientsColormap.get(clientId)} ${styles.clientIdLabelBorder}`} />
                </div>
              ))
            }
          </span>

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
        <div
          className={styles.editor}
          data-testid='editor'>
          <Editor
            collaboration={collaboration}
            compilationState={compilationState}
            compilationError={compilationError}
            compilationLogs={compilationLogs}
            onTextChangeCompilationCallback={setText}
          />
        </div>
      </div>

      {
        collaboration.clientsConnectedIds.map((clientId) => (
          <Tooltip
            key={'tooltip_'+clientId}
            anchorSelect={'.'+collaboration.clientsColormap.get(clientId)}
            place='bottom'
            content={clientId} />
        ))
      }

      <Alert visible={collaboration.connectionState === ReadyState.CLOSED}>
        <RiWifiOffLine size={52} />
        <label className={styles.alertLabel}>
          You are offline, please refresh page.
        </label>
      </Alert>

      <Alert visible={collaboration.connectionState === ReadyState.CONNECTING}>
        <LoadingSpinner
          ariaLabel='connecting spinner'
          testId='connecting-spinner' />
        <label className={styles.alertLabel}>
          Connecting to server...
        </label>
      </Alert>
    </>
  );  
};

export default MainPage;

