import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { Button, Editor } from '@components';
import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OperationState, Resource } from '@model';
import { ReadyState } from 'react-use-websocket';
import { UserContext } from 'context/UserContextProvider';
import { compileDocument } from './service/compilation-service';
import styles from './Main.module.less';
import { useCollaboration } from './collaboration/collaboration';
import { useKeyDown } from 'util/keyboard/keyboard';
import ResourceList from './resource-list/ResourceList';

const mockResourceList: Resource[] = [
  {
    projectId: '0',
    resourceId: '0',
    name: 'main.tex'
  },
  {
    projectId: '0',
    resourceId: '1',
    name: 'image_1.png'
  },
  {
    projectId: '0',
    resourceId: '2',
    name: 'image_2.png'
  }
];

const MainPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [ toolbarCollapsed, setToolbarCollapsed ] = useState<boolean>(false);

  const [ resourceList, setResourceList ] = useState<Resource[]>(mockResourceList);

  const { user, logout } = useContext(UserContext);

  const [documentUrl, setDocumentUrl] = useState<string>('example.pdf');
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

    compileDocument(text)
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
    <div className={styles.root}>
      <div className={styles.header}>
        <Button
          className={styles.closeProjectButton}
          ariaLabel='close project button'
          onClick={onCloseClick}
          testId='close-project-button'
          value='Close Project'/>

        <span>Clients connected: {collaboration.clientsConnectedIds.join(' ')}</span>

        <span>WebSocket status: {collaboration.connectionState && ReadyState[collaboration.connectionState]}</span>

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
          <Button
            className={styles.collapseToolbarButton}
            ariaLabel='collapse toolbar button'
            onClick={() => setToolbarCollapsed(!toolbarCollapsed)}
            testId='collapse-toolbar-button'
          >
          { 
            toolbarCollapsed
            ? <MdOutlineArrowForwardIos className={styles.openToolbar} size={24}/>
            : <MdOutlineArrowBackIos className={styles.openToolbar} size={24}/>
          }
          </Button>
        </div>
        <ResourceList
          resourceList={resourceList}
          collapsed={toolbarCollapsed}
        />
        <div
          className={styles.editor}
          data-testid='editor'>
          <Editor
            collaboration={collaboration}
            compilationState={compilationState}
            compilationError={compilationError}
            compilationLogs={compilationLogs}
            documentUrl={documentUrl}
            onTextChangeCompilationCallback={setText}
          />
        </div>
      </div>
    </div>
  );  
};

export default MainPage;

