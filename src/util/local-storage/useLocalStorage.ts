import { useState } from 'react';

const getInitialValue = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const useLocalStorage = <T>(key: string) => {
  const [storedValue, setStoredValue] = useState<T | null>(getInitialValue(key));

  const setValue = (value: T) => {
    try {
      value ? 
        localStorage.setItem(key, JSON.stringify(value)) :
        localStorage.removeItem(key);
      setStoredValue(value);
    } catch (error) {
      console.log(error);
    }
  };

  const clearValue = () => setValue(null);
  
  return { storedValue, setValue, clearValue };
};
