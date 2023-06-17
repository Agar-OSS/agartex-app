import { AlertState } from '@model';
import { CSSTransition } from 'react-transition-group';
import { ReactNode } from 'react';
import styles from './Modal.module.less';

interface Props {
  state: AlertState,
  children: ReactNode | ReactNode[]
}

/* This matches the @transitionLength variable in Modal.module.less. */
const ALERT_TRANSITION_LENGTH = 200;

const Alert = (props: Props) => {
  const alertClassNames = {
    enter: styles.alertEnter,
    enterActive: styles.alertEnterActive,
    exitActive: styles.alertExitActive
  };

  return (
    <CSSTransition
      in={props.state !== AlertState.CLOSED}
      timeout={ALERT_TRANSITION_LENGTH}
      classNames={alertClassNames}
      unmountOnExit
    >
      <div className={styles.bodyContainer}>
        { props.children }
      </div>
    </CSSTransition>
  );
};

export default Alert;

