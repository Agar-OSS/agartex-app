import { Button } from '@components';
import pfp from './pfp.png';
import styles from './UserBox.module.less';

interface Props {
  onLogoutButtonClick: () => void
}

const UserBox = (props: Props) => {
  return (
    <div 
      data-testid='projects-page-user-box'
      className={styles.userBoxContainer} >
      
      <img
        className={styles.profilePicture}
        src={pfp}
      />

      <div className={styles.userDetailsContainer}>
        <label>user_email@gmail.com</label>
      </div>

      <Button
        ariaLabel='logout button'
        testId='user-box-logout-button'
        onClick={props.onLogoutButtonClick}
        value='Logout' />
    </div>
  );
};

export { UserBox };
