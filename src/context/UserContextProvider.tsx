import { ReactNode, createContext } from 'react';
import { User, UserContextType } from '@model';
import { useLocalStorage } from 'util/local-storage/useLocalStorage';

interface Props {
  children: ReactNode | ReactNode[]
}

export const UserContext = createContext<UserContextType | null>(null);

const USER_STORAGE_KEY = 'agartex-user';

const UserProvider = (props: Props) => {
  const { 
    storedValue: user, 
    setValue: setUser, 
    clearValue: logout
  } = useLocalStorage<User>(USER_STORAGE_KEY);

  return (
    <UserContext.Provider
      value={{ user, setUser, logout }}
    >
      { props.children }
    </UserContext.Provider>
  );
};

export default UserProvider;
