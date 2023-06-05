import { Button, LoadingSpinner } from '@components';
import { AiOutlineClose } from 'react-icons/ai';
import { CSSTransition } from 'react-transition-group';
import { ModalState } from '@model';
import { ReactNode } from 'react';
import styles from './Modal.module.less';
import { useKeyDown } from 'util/keyboard/keyboard';

interface Props {
  ariaLabel: string,
  state: ModalState,
  setState: (state: ModalState) => void,
  header?: ReactNode,
  body?: ReactNode,
  footer?: ReactNode
}

/* This matches the @transitionLength variable in Modal.module.less. */
const MODAL_TRANSITION_LENGTH = 200;

const Modal = (props: Props) => {
  const closeModal = () => {
    props.setState(ModalState.CLOSED);
  };

  useKeyDown('Escape', closeModal);

  const closeButton = 
    <Button
      ariaLabel='modal close button'
      testId='modal-close-button'
      className={styles.closeButton}
      onClick={closeModal} >
      <AiOutlineClose size={24} />
    </Button>;

  const backgroundClassNames = {
    enter: styles.backgroundEnter,
    enterActive: styles.backgroundEnterActive,
    exitActive: styles.backgroundExitActive
  };

  const modalClassNames = {
    enter: styles.modalEnter,
    enterActive: styles.modalEnterActive,
    exitActive: styles.modalExitActive
  };

  return (
    <>
      <CSSTransition
        in={props.state !== ModalState.CLOSED}
        timeout={MODAL_TRANSITION_LENGTH}
        classNames={backgroundClassNames}
        unmountOnExit
      >
        <div 
          aria-hidden='true'
          className={styles.background}
          onClick={closeModal}
        />
      </CSSTransition>
      
      <CSSTransition
        in={props.state !== ModalState.CLOSED}
        timeout={MODAL_TRANSITION_LENGTH}
        classNames={modalClassNames}
        unmountOnExit
      >
        <div 
          aria-label={props.ariaLabel}
          className={styles.modal}  
        >
          <div className={styles.headerContainer}>
            { props.header }
            <div className={styles.closeButtonContainer}>
              { closeButton }
            </div>
          </div>
          <div className={styles.bodyContainer}>
            { props.state === ModalState.LOADING ? 
              <LoadingSpinner 
                ariaLabel='modal loading spinner'
                testId='modal-loading-spinner'
              /> : props.body }
          </div>
          <div className={styles.footerContainer}>
            { props.footer }
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

export default Modal;

