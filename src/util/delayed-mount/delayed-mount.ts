import { useEffect, useState } from 'react';

export const useDelayedMount = (desiredState: boolean, delayTime: number) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (desiredState && !mounted) {
      setMounted(true);
    } else if (desiredState && !visible) {
      setVisible(true);
    } else if (!desiredState && visible) {
      setVisible(false);
      timeoutId = setTimeout(() => setMounted(false), delayTime);
    }

    return () => clearTimeout(timeoutId);
  }, [mounted, visible, desiredState, delayTime]);

  return { mounted, visible };
};
