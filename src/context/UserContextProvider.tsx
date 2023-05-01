import { ReactNode, createContext, useEffect } from 'react';
import { User, UserContextType } from '@model';
import { USER_STORAGE_KEY } from '@constants';
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
    clearValue: logout
  } = useLocalStorage<User>(USER_STORAGE_KEY);

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
