import { AiFillFolder, AiFillTool } from 'react-icons/ai';
import { useContext, useState } from 'react';
import { Button } from '@components';
import Editor from './Editor';
import { UserContext } from 'context/UserContextProvider';
import { compileDocument } from './service/compilation-service';
import styles from './Main.module.less';

const MainPage = () => {
  const { user, logout } = useContext(UserContext);

  const [documentSource, setDocumentSource] = useState<string>('');
  const [documentUrl, setDocumentUrl] = useState<string>('example.pdf');
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [compilationLogs, setCompilationLogs] = useState<string>('');

  const onLogoutClick = () => {
    logout();
  };

  const onCompilationButtonClick = () => {
    setCompilationError(null);
    setCompilationLogs('');

    compileDocument(documentSource)
      .then((response) => {
        setDocumentUrl(window.URL.createObjectURL(new Blob([response.data])));
      })
      .catch((error) => {
        setCompilationError(error.message);
        console.log(error.message);
        if (error.response.status === 422) {
          error.response.data.text()
            .then((logs) => setCompilationLogs(logs));
        }
      });
  };
  
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        { user?.email }
        <Button
          ariaLabel='logout button'
          onClick={onLogoutClick}
          testId='logout-button'
          value='Logout'/>
        <Button 
          ariaLabel='compile button'
          onClick={onCompilationButtonClick}
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
            compilationError={compilationError}
            compilationLogs={compilationLogs}
            documentUrl={documentUrl}
            onDocumentSourceChange={setDocumentSource}
          />
        </div>
      </div>
    </div>
  );  
};

export default MainPage;
