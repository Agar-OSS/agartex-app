import { Button, FileInput, Modal } from '@components';

import { ModalState } from '@model';
import styles from './UploadResourceModal.module.less';
import { useState } from 'react';

interface Props {
  state: ModalState,
  setState: (state: ModalState) => void,
  onSubmit: (resourceName: string, resourceFile: File) => void
}

const UploadResourceModal = (props: Props) => {
  const [resourceFile, setResourceFile] = useState<File | null>(undefined);
  
  const modalHeader = 
    <div className={styles.uploadResourceModalHeader}>
      Upload resource
    </div>;

  const modalBody = 
    <div className={styles.uploadResourceModalBody}>
      { /* TODO: This should use useForm hook for proper validation. */ }
      { /* Should be done when we implement actual service call for this logic */ }
      <FileInput
        ariaLabel='resource file input'
        testId='resource-file-input'
        isValid={resourceFile !== null && (resourceFile === undefined || resourceFile.size <= 10*1024*1024)}
        accept='image/*'
        onChange={(val: File) => setResourceFile(val)}
        errorMessage='Wrong image (max. 10MB)'
      />  
    </div>;

  const modalFooter =
    <div className={styles.uploadResourceModalFooter}>
      <Button
        ariaLabel='close create project modal'
        testId='create-project-modal-close-button'
        value='Close'
        onClick={() => props.setState(ModalState.CLOSED)}
      />
      <Button
        ariaLabel='submit resource upload'
        testId='upload-resource-modal-submit-button'
        value='Upload'
        onClick={() => { 
          props.setState(ModalState.LOADING);
          props.onSubmit(resourceFile.name, resourceFile);
        }}
      />
    </div>;

  return (
    <Modal
      ariaLabel='create project modal'
      state={props.state}
      setState={props.setState}
      header={modalHeader}
      body={modalBody}
      footer={modalFooter} />
  );
};

export default UploadResourceModal;
