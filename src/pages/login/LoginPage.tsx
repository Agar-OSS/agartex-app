import { AgarLogo, Button } from '@components';
import { useEffect, useState } from 'react';
import { LoginForm } from './form/LoginForm';
import { OperationState } from '@model';
import styles from './LoginPage.module.less';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [state, setState] = useState<OperationState>(OperationState.INPUT);
  const navigate = useNavigate();

  useEffect(() => {
    if (state === OperationState.SUCCESS) {
      navigate('/');
    }
  });

  const navigateToCreateAccountPage = () => {
    navigate('/create-account');
  };

  return (
    <div className={styles.loginPageContainer}>
      <AgarLogo 
        className={styles.logoContainer}
        ariaLabel='agartex logo'
        testId='login-agartex-logo'/>

      <div className={styles.loginFormHeader}>
        Welcome back!
      </div>

      <LoginForm
        formState={state}
        setFormState={setState}
        setErrorMessage={setErrorMessage} 
      />

      <Button 
        ariaLabel='create account button'
        disabled={state === OperationState.LOADING}
        testId='create-account-button'
        value='Create account'
        onClick={navigateToCreateAccountPage}
      />

      <div className={styles.errorMessageContainer}>
        { errorMessage }
      </div>
    </div>
  );
};

export default LoginPage;
