import { Button, LoadingSpinner, TextInput } from '@components';
import { EMAIL_VALIDATION_RULES, PASSWORD_VALIDATION_RULES } from '../../../util/validators/common-rules';
import { Field, useForm } from '../../../util/forms/forms';
import { Fragment } from 'react';
import { OperationState } from '@constants';
import { login } from './../service/login-service';
import styles from './LoginForm.module.less';
import { validateString } from '../../../util/validators/string-validator';

interface Props {
  formState: OperationState,
  setFormState: (state: OperationState) => void,
  setErrorMessage: (error: string) => void
}

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

const LoginForm = (props: Props) => {
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

  const submitLoginForm = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isFormValid()) return;

    props.setFormState(OperationState.LOADING);
    props.setErrorMessage('');

    login(buildRequestBody())
      .then(() => {
        props.setFormState(OperationState.SUCCESS);
      })
      .catch((error) => {
        props.setFormState(OperationState.INPUT);
        // TODO: This error message is temporary. For debugging.
        props.setErrorMessage('message: ' + error.message + ', code: ' + error.code);
        console.log(error);
      });
  };

  return (
    <form onSubmit={submitLoginForm}>
      <div className={styles.loginFormContainer}>
        { props.formState === OperationState.LOADING && 
          <LoadingSpinner 
            ariaLabel='create account loading spinner'
            testId='create-account-loading-spinner'
            className={styles.loadingSpinner}
          />
        }
        { props.formState === OperationState.INPUT && (
          <Fragment>
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
          </Fragment>)
        }

        <Button
          ariaLabel='login button'
          disabled={props.formState !== OperationState.INPUT}
          testId='login-button'
          value='Sign in'
          type='submit'
        />
      </div>
    </form>
  );
};

export { LoginForm };
