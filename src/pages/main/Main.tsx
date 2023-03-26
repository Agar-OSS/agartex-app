import { Button } from '@components';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('user-token');
    navigate('/login');
  };
  
  return (
    <Fragment>
      You are logged in. Your token: {localStorage.getItem('user-token')}
      <br/>
      <Button
        ariaLabel='logout button'
        testId='logout-button'
        value='Logout'
        onClick={logout}
      />
    </Fragment>
  );  
};

export default MainPage;
