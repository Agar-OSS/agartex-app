import { Button, Modal } from '@components';

import { ModalState } from '@model';
import styles from './ShareModal.module.less';

interface Props {
  token: string | null,
  state: ModalState,
  setState: (state: ModalState) => void
}

const ShareModal = (props: Props) => {
  const FRONTEND_URL = window.location.origin;

  const modalHeader = 
    <div className={styles.shareProjectModalHeader}>
      Share your project
    </div>;

  const modalBody = 
    <div className={styles.shareProjectModalBody}>
      <label>Your sharing link is</label>
      <label>{`${FRONTEND_URL}/share/${props.token}`}</label>
    </div>;

  const modalFooter =
    <div className={styles.shareProjectModalFooter}>
      <Button
        ariaLabel='close share project modal'
        testId='share-modal-close-button'
        value='Close'
        onClick={() => props.setState(ModalState.CLOSED)}
      />
    </div>;

  return (
    <Modal
      ariaLabel='share project modal'
      state={props.state}
      setState={props.setState}
      header={modalHeader}
      body={modalBody}
      footer={modalFooter} />
  );
};

export default ShareModal;
