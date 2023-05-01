import { Button } from '@components';
import { UserContext } from 'context/UserContextProvider';
import pfp from './pfp.png';
import styles from './UserBox.module.less';
import { useContext } from 'react';

interface Props {
  onLogoutButtonClick: () => void
}

const UserBox = (props: Props) => {
  const { user } = useContext(UserContext);

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
        ariaLabel='logout button'
        testId='user-box-logout-button'
        onClick={props.onLogoutButtonClick}
        value='Logout' />
    </div>
  );
};

export { UserBox };
