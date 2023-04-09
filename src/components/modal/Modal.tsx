import { Button, LoadingSpinner } from '@components';
import { AiOutlineClose } from 'react-icons/ai';
import { ModalState } from '@constants';
import { ReactNode } from 'react';
import styles from './Modal.module.less';
import { useDelayedMount } from 'util/delayed-mount/delayed-mount';

interface Props {
  ariaLabel: string,
  state: ModalState,
  setState: (state: ModalState) => void,
  headerString: string,
  body: ReactNode,
  footer?: ReactNode
}

const Modal = (props: Props) => {
  const { mounted, visible } = useDelayedMount(props.state !== ModalState.CLOSED, 200);

  const closeButton = 
    <Button
      ariaLabel='modal close button'
      testId='modal-close-button'
      className={styles.closeButton}
      onClick={() => props.setState(ModalState.CLOSED)} >
      <AiOutlineClose size={24} />
    </Button>;

  const visibilityClass = visible ? styles.visible : styles.hidden;
  
  return (
    <>
      { mounted && (
        <div 
          aria-label={props.ariaLabel}
          className={`${styles.modalContainer} ${visibilityClass}`}
        >
          <div className={styles.headerContainer}>
            { props.headerString }
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
        </div>)
      }
    </>
  );
};

export default Modal;
