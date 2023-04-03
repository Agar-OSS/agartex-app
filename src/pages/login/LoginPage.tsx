import { AgarLogo, Button, LoadingSpinner, TextInput } from '@components';
import { EMAIL_VALIDATION_RULES, PASSWORD_VALIDATION_RULES } from '../../util/validators/common-rules';
import { Field, useForm } from '../../util/forms/forms';
import { OperationState } from '@constants';
import { login } from './service/login-service';
import styles from './LoginPage.module.less';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { validateString } from '../../util/validators/string-validator';

const LoginPage = () => {
  const formDefinition: Map<string, Field> = new Map([
    [ 'email', { 
      initialValue: '', 
      validator: (val: string) => validateString(val, EMAIL_VALIDATION_RULES)
    }],
    [ 'password', {
      initialValue: '',
      validator: (val: string) => validateString(val, PASSWORD_VALIDATION_RULES)
    }]
  ]);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [state, setState] = useState<OperationState>(OperationState.INPUT);
  const navigate = useNavigate();
  const { 
    formState, 
    isInErrorState, 
    isFormValid, 
    onFieldTouch, 
    onFieldValueChange 
  } = useForm(formDefinition);

  const buildRequestBody = () => ({
    email: formState.get('email').value as string,
    password: formState.get('password').value as string,
  });

  const submitLoginForm = () => {
    if (!isFormValid()) return;

    setState(OperationState.LOADING);
    setErrorMessage('');

    login(buildRequestBody())
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        setState(OperationState.INPUT);
        // TODO: This error message is temporary. For debugging.
        setErrorMessage('message: ' + error.message + ', code: ' + error.code);
        console.log(error);
      });
  };

  const navigateToCreateAccountPage = () => {
    navigate('/create-account');
  };

  return (
    <div className={styles.loginFormContainer}>
      <AgarLogo 
        className={styles.logoContainer}
        ariaLabel='agartex logo'
        testId='login-agartex-logo'/>

      <div className={styles.loginFormHeader}>
        Welcome back!
      </div>

      { state === OperationState.INPUT && (
        <>
          <TextInput
            ariaLabel='email text field'
            testId='login-email-text-input'
            initialValue={formState.get('email').value as string}
            placeholder='Enter your email'
            type='text'
            onChange={(val) => onFieldValueChange('email', val)}
            onFocus={() => onFieldTouch('email')}
            isValid={!isInErrorState('email')}
            errorMessage='Email is invalid'
          />

          <TextInput
            ariaLabel='password text field'
            testId='login-password-text-input'
            initialValue={formState.get('password').value as string}
            placeholder='Enter your password'
            type='password'
            onChange={(val) => onFieldValueChange('password', val)}
            onFocus={() => onFieldTouch('password')}
            isValid={!isInErrorState('password')}
            errorMessage='Password does not meet requirements'
          />
        </>)
      }
      { state === OperationState.LOADING && 
        <LoadingSpinner 
          ariaLabel='create account loading spinner'
          testId='create-account-loading-spinner'
          className={styles.loadingSpinner}
        />
      }

      <Button
        ariaLabel='login button'
        disabled={state !== OperationState.INPUT}
        testId='login-button'
        value='Sign in'
        onClick={submitLoginForm}
      />

      <Button 
        ariaLabel='create account button'
        disabled={state !== OperationState.INPUT}
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
