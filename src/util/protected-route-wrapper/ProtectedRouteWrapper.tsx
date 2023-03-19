import { Fragment, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateUserToken } from './service/protected-route-wrapper-service';

interface Props {
  children: ReactNode | ReactNode[]
}

const ProtectedRouteWrapper = (props: Props) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkUserToken = () => {
    const userToken = localStorage.getItem('user-token');

    if (!validateUserToken(userToken)) {
      setIsLoggedIn(false);
      return navigate('/login');
    }    
    setIsLoggedIn(true);
  };

  useEffect(() => {
    checkUserToken();
  }, [isLoggedIn]);

  return (
    <Fragment>
      {
        isLoggedIn ? props.children : null
      }
    </Fragment>
  );
};

export default ProtectedRouteWrapper;
