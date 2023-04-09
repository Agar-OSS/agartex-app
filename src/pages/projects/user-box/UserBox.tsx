import messi from './messi.png';
import styles from './UserBox.module.less';

const UserBox = () => {
  return (
    <div 
      data-testid='projects-page-user-box'
      className={styles.userBoxContainer} >
      
      <img
        style={{ width: '350px', height: '350px' }}
        src={messi}
      />

      Messi...

    </div>
  );
};

export { UserBox };
