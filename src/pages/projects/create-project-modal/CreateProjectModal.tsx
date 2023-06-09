import { Button, Modal, TextInput } from '@components';
import { ModalState } from '@model';
import styles from './CreateProjectModal.module.less';
import { useState } from 'react';

interface Props {
  state: ModalState,
  setState: (state: ModalState) => void,
  onSubmit: (newProjectName: string) => Promise<void>
}

const CreateProjectModal = (props: Props) => {
  const [newProjectName, setNewProjectName] = useState<string>('');
  
  const modalHeader = 
    <div className={styles.createProjectModalHeader}>
      Create new project
    </div>;

  const modalBody = 
    <div className={styles.createProjectModalBody}>
      { /* TODO: This should use useForm hook for proper validation. */ }
      { /* Should be done when we implement actual service call for this logic */ }
      <TextInput
        ariaLabel='project name text input'
        testId='create-project-name-text-input'
        placeholder='Enter project name'
        isValid={true}
        onChange={(val: string) => setNewProjectName(val)}
      />  
    </div>;

  const modalFooter =
    <div className={styles.createProjectModalFooter}>
      <Button
        ariaLabel='close create project modal'
        testId='create-project-modal-close-button'
        value='Close'
        onClick={() => props.setState(ModalState.CLOSED)}
      />
      <Button
        ariaLabel='submit project creation'
        testId='create-project-modal-submit-button'
        value='Create project'
        onClick={() => { 
          props.setState(ModalState.LOADING);
          
          props.onSubmit(newProjectName).then(() => {
            props.setState(ModalState.CLOSED);
          }).catch(error => {
            console.log(error);
            props.setState(ModalState.INPUT);
          });
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

export default CreateProjectModal;
