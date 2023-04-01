import { AiFillFolder, AiFillTool } from 'react-icons/ai';

import { Button } from '@components';
import Editor from './Editor';
import styles from './Main.module.less';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('user-token');
    navigate('/login');
  };
  
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        Username
        <Button
          ariaLabel='logout-button'
          onClick={logout}
          testId='logout-button'
          value='Logout'/>
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
          <Editor/>
        </div>
      </div>
    </div>
  );  
};

export default MainPage;
