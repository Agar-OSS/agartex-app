import { Button, LoadingSpinner } from '@components';
import { AiOutlineClose } from 'react-icons/ai';
import { ModalState } from '@model';
import { ReactNode } from 'react';
import styles from './Modal.module.less';
import { useDelayedMount } from 'util/delayed-mount/delayed-mount';

interface Props {
  ariaLabel: string,
  state: ModalState,
  setState: (state: ModalState) => void,
  header?: ReactNode,
  body?: ReactNode,
  footer?: ReactNode
}

const Modal = (props: Props) => {
  const { mounted, visible } = useDelayedMount(props.state !== ModalState.CLOSED, 200);

  const closeModal = () => {
    props.setState(ModalState.CLOSED);
  };

  const closeButton = 
    <Button
      ariaLabel='modal close button'
      testId='modal-close-button'
      className={styles.closeButton}
      onClick={closeModal} >
      <AiOutlineClose size={24} />
    </Button>;

  const backgroundVisibilityClass = visible ? styles.backgroundVisible : styles.backgroundHidden;
  const modalVisibilityClass = visible ? styles.modalVisible : styles.modalHidden;

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div 
        aria-hidden='true'
        className={`${styles.modalBackground} ${backgroundVisibilityClass}`}
        onClick={closeModal}
      />
      <div
        aria-label={props.ariaLabel}
        className={`${styles.modalContainer} ${modalVisibilityClass}`}
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
    </>
  );
};

export default Modal;
