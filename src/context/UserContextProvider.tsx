import { AGARTEX_SERVICE_SESSIONS_URL, USER_STORAGE_KEY } from '@constants';
import { ReactNode, createContext, useEffect } from 'react';
import { User, UserContextType } from '@model';

import axios from 'axios';
import { useLocalStorage } from 'util/local-storage/useLocalStorage';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode | ReactNode[]
}

export const UserContext = createContext<UserContextType | null>(null);

const UserProvider = (props: Props) => {
  const navigate = useNavigate();

  const { 
    storedValue: user, 
    setValue: setUser, 
    clearValue: softLogout
  } = useLocalStorage<User>(USER_STORAGE_KEY);

  const uninterceptedAxios = axios.create();
  const logout = () => {
    uninterceptedAxios.delete(AGARTEX_SERVICE_SESSIONS_URL)
      .then(() => {
        softLogout();
      }).catch((error) => {
        if (error?.response.status === 401) {
          softLogout();
        } else {
          // TODO: actuall error handling
          console.log(error);
        }
      });
  };

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response.status === 401) {
        // TODO: Info modal
        logout();
        console.log('User not authenticated, redirecting to login page...');
      } else if (error?.response.status == 403) {
        // TODO: Info modal
        navigate('/');
        console.log('User are not allowed to perform operation, redirecting to projects page');
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, setUser, logout }}
    >
      { props.children }
    </UserContext.Provider>
  );
};

export default UserProvider;
