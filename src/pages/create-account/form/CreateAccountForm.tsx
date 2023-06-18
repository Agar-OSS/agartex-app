import { Button, LoadingSpinner, TextInput } from '@components';
import { EMAIL_VALIDATION_RULES, PASSWORD_VALIDATION_RULES } from '../../../util/validators/common-rules';
import { Field, FormState, useForm } from '../../../util/forms/forms';
import { Fragment } from 'react';
import { OperationState } from '@model';
import { createAccount } from './../service/create-account-service';
import styles from './CreateAccountForm.module.less';
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
  }],
  [ 'confirmPassword', {
    initialValue: '',
    validator: (val: string, formState?: FormState) => val === formState?.get('password')?.value
  }]
]);

const CreateAccountForm = (props: Props) => {
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

  const submitCreateAccountForm = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isFormValid()) return;

    props.setFormState(OperationState.LOADING);
    props.setErrorMessage('');

    createAccount(buildRequestBody())
      .then(() => {
        props.setFormState(OperationState.SUCCESS);
      })
      .catch((error) => {
        props.setFormState(OperationState.INPUT);
        if (error.code === 409) {
          props.setErrorMessage('User with given email already exists.');
        } else if (error.code == 422) {
          props.setErrorMessage('Given email is not correct or password is too weak.')
        } else {
          props.setErrorMessage('Unknown error: ' + error.code);
          console.log(error);
        }
      });
  };

  return (
    <form onSubmit={submitCreateAccountForm}>  
      <div className={styles.createAccountFormContainer}>  
        { props.formState === OperationState.LOADING && 
          <LoadingSpinner 
            ariaLabel='create account loading spinner'
            testId='create-account-loading-spinner'
            className={styles.loadingSpinner}
          />
        }
        { props.formState === OperationState.INPUT &&
          <Fragment>
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
              errorMessage='Password must have from 8 to 32 characters, contain 1 small letter, big letter, digit and special character'
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
          </Fragment>
        }

        <Button
          ariaLabel='create account submit button'
          disabled={props.formState !== OperationState.INPUT}
          testId='create-account-submit-button'
          value='Submit'
          type='submit'
        />
      </div>
    </form> 
  );
};

export { CreateAccountForm };
