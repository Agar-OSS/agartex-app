import { AgarLogo, Button } from '@components';
import { useEffect, useState } from 'react';

import { AGARTEX_TITLE } from '@constants';
import { CreateAccountForm } from './form/CreateAccountForm';
import { CreateAccountSuccessBox } from './success-box/CreateAccountSuccessBox';
import { OperationState } from '@model';
import styles from './CreateAccountPage.module.less';
import { useNavigate } from 'react-router-dom';

const CreateAccountPage = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [state, setState] = useState<OperationState>(OperationState.INPUT);
  const navigate = useNavigate();

  const navigateToLoginPage = () => {
    navigate('/login');
  };

  useEffect(() => {
    document.title = 'Sign up - ' + AGARTEX_TITLE;
  }, []);

  return (
    <div className={styles.createAccountPageContainer}>
      <AgarLogo 
        className={styles.logoContainer}
        ariaLabel='agartex logo'
        testId='create-account-agartex-logo'/>

      <div className={styles.createAccountFormHeader}>
        Create new account
      </div>

      { state !== OperationState.SUCCESS ?
        <CreateAccountForm 
          formState={state}
          setFormState={setState}
          setErrorMessage={setErrorMessage}
        /> : <CreateAccountSuccessBox />
      }
      
      <Button 
        ariaLabel='back to login button'
        disabled={state === OperationState.LOADING}
        testId='back-to-login-button'
        value='Go back to login'
        onClick={navigateToLoginPage}
      />
    
      <div className={styles.errorMessageContainer}>
        { errorMessage }
      </div>
    </div>
  );
};

export default CreateAccountPage;
