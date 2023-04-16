import { useEffect, useState } from 'react';

export const useDelayedMount = (desiredState: boolean, delayTime: number) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (desiredState && !mounted) {
      setMounted(true);
    } else if (desiredState && !visible) {
      setVisible(true);
    } else if (!desiredState && visible) {
      setVisible(false);
      setTimeout(() => setMounted(false), delayTime);
    }
  }, [mounted, visible, desiredState, delayTime]);

  return { mounted, visible };
};
