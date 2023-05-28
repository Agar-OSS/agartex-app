import { useEffect } from 'react';

const useKeyDown = (key: string, callback: () => void, ctrlKey = false) => {
  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === key && (!ctrlKey || event.ctrlKey)) {
        event.preventDefault();
        event.stopPropagation();
        callback();
      }
    };
    document.addEventListener('keydown', keyDown);
    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  });
};

export { useKeyDown };
