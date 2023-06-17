import { CSSTransition } from 'react-transition-group';
import { ReactNode } from 'react';
import styles from './Alert.module.less';

interface Props {
  visible: boolean,
  children: ReactNode | ReactNode[]
}

/* This matches the @transitionLength variable in Modal.module.less. */
const ALERT_TRANSITION_LENGTH = 200;

const Alert = (props: Props) => {
  const backgroundClassNames = {
    enter: styles.backgroundEnter,
    enterActive: styles.backgroundEnterActive,
    exitActive: styles.backgroundExitActive
  };

  const alertClassNames = {
    enter: styles.alertEnter,
    enterActive: styles.alertEnterActive,
    exitActive: styles.alertExitActive
  };

  return (
    <>
      <CSSTransition
        in={props.visible}
        timeout={ALERT_TRANSITION_LENGTH}
        classNames={backgroundClassNames}
        unmountOnExit
      >
        <div aria-hidden='true' className={styles.background}/>
      </CSSTransition>

      <CSSTransition
        in={props.visible}
        timeout={ALERT_TRANSITION_LENGTH}
        classNames={alertClassNames}
        unmountOnExit
      >
        <div className={styles.alert}>
          <div className={styles.bodyContainer}>
            { props.children }
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

export default Alert;

