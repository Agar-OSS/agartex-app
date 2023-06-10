import { Button } from '@components';
import { UserContext } from 'context/UserContextProvider';
import pfp from './pfp.png';
import styles from './UserBox.module.less';
import { useContext } from 'react';

const UserBox = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <div 
      data-testid='projects-page-user-box'
      className={styles.userBoxContainer} >
      
      <img
        className={styles.profilePicture}
        src={pfp}
      />

      <div className={styles.userDetailsContainer}>
        <label>{ user && user.email }</label>
      </div>

      <Button
        className={styles.userBoxLogoutButton}
        ariaLabel='logout button'
        testId='user-box-logout-button'
        onClick={logout}
        value='Logout' />
    </div>
  );
};

export { UserBox };
