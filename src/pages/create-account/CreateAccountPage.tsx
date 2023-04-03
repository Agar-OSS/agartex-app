import { AgarLogo, Button, LoadingSpinner, TextInput } from '@components';
import { EMAIL_VALIDATION_RULES, PASSWORD_VALIDATION_RULES } from '../../util/validators/common-rules';
import { Field, FormState, useForm } from '../../util/forms/forms';
import { CreateAccountSuccessBox } from './success-box/CreateAccountSuccessBox';
import { OperationState } from '@constants';
import { createAccount } from './service/create-account-service';
import styles from './CreateAccountPage.module.less';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { validateString } from '../../util/validators/string-validator';

const CreateAccountPage = () => {
  const formDefinition: Map<string, Field> = new Map([
    [ 'email', { 
      initialValue: '', 
      validator: (val: string) => validateString(val, EMAIL_VALIDATION_RULES)
    }],
    [ 'password', {
      initialValue: '',
      validator: (val: string) => validateString(val, PASSWORD_VALIDATION_RULES)
    }],
    [ 'confirmPassword', {
      initialValue: '',
      validator: (val: string, formState?: FormState) => val === formState?.get('password')?.value
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

  const submitCreateAccountForm = () => {
    if (!isFormValid()) return;

    setState(OperationState.LOADING);
    setErrorMessage('');

    createAccount(buildRequestBody())
      .then(() => {
        setState(OperationState.SUCCESS);
      })
      .catch((error) => {
        setState(OperationState.INPUT);
        // TODO: This error message is temporary. For debugging.
        setErrorMessage('message: ' + error.message + ', code: ' + error.code);
        console.log(error);
      });
  };

  const navigateToLoginPage = () => {
    navigate('/login');
  };

  return (
    <div className={styles.createAccountFormContainer}>
      <AgarLogo 
        className={styles.logoContainer}
        ariaLabel='agartex logo'
        testId='create-account-agartex-logo'/>

      <div className={styles.createAccountFormHeader}>
        Create new account
      </div>

      { state === OperationState.INPUT && (
        <>      
          <TextInput
            ariaLabel='email text field'
            testId='create-account-email-text-input'
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
            testId='create-account-password-text-input'
            initialValue={formState.get('password').value as string}
            placeholder='Enter your password'
            type='password'
            onChange={(val) => onFieldValueChange('password', val)}
            onFocus={() => onFieldTouch('password')}
            isValid={!isInErrorState('password')}
            errorMessage='Password does not meet requirements'
          />

          <TextInput
            ariaLabel='confirm password text field'
            testId='create-account-confirm-password-text-input'
            initialValue={formState.get('confirmPassword').value as string}
            placeholder='Confirm your password'
            type='password'
            onChange={(val) => onFieldValueChange('confirmPassword', val)}
            onFocus={() => onFieldTouch('confirmPassword')}
            isValid={!isInErrorState('confirmPassword')}
            errorMessage='Password does not match'
          />
        </>)
      }
      { state === OperationState.SUCCESS && <CreateAccountSuccessBox /> }
      { state === OperationState.LOADING && 
        <LoadingSpinner 
          ariaLabel='create account loading spinner'
          testId='create-account-loading-spinner'
          className={styles.loadingSpinner}
        />
      }

      <Button
        ariaLabel='create account submit button'
        disabled={state !== OperationState.INPUT}
        testId='create-account-submit-button'
        value='Submit'
        onClick={submitCreateAccountForm}
      />
      
      <Button 
        ariaLabel='back to login button'
        disabled={state !== OperationState.INPUT}
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
