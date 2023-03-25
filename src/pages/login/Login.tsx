import { AgarLogo, Button, TextInput } from '../../components';
import { Fragment, useState } from 'react';
import { login } from './service/login-service';
import styles from './Login.module.less';
import { useNavigate } from 'react-router-dom';
import { validateString } from '../../util/validators/string-validator';

interface LoginFormData {
  email: string,
  password: string
}

const emptyLoginFormData = (): LoginFormData => ({
  email: '',
  password: ''
});

const LoginPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(emptyLoginFormData());
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const submitLoginForm = () => {
    if (!validateForm()) return;

    login(data)
      .then((token) => {
        localStorage.setItem('user-token', token);
        navigate('/');
      })
      .catch((error) => {
        // TODO: Actual error handling
        console.log(error.message);

        // This is only for testing until login endpoint is actually implemented
        localStorage.setItem('user-token', 'mock-token');
        navigate('/');
      });
  };

  const navigateToCreateAccountPage = () => {
    navigate('/create-account');
  };
  
  const validateEmail = (): boolean => {
    const isValid = validateString(data.email, { minLength: 5, maxLength: 50 });
    setIsEmailValid(isValid);
    return isValid;
  };

  const validatePassword = (): boolean => {
    const isValid = validateString(data.password, { minLength: 5, maxLength: 50 });
    setIsPasswordValid(isValid);
    return isValid;
  };

  const validateForm = () => {
    let isValid = validateEmail();
    isValid = validatePassword() && isValid;
    return isValid;
  };

  const handleInputChange = (name: string, val: string) => {
    setData({...data, [name]: val});
    (name === 'email' ? validateEmail() : validatePassword());
  };

  return (
    <Fragment>
      <div className={styles.loginFormContainer}>
        <AgarLogo 
          className={styles.logoContainer}
          ariaLabel='agartex logo'
          testId='login-agartex-logo'/>

        <TextInput
          ariaLabel='email text field'
          testId='login-email-text-input'
          initialValue=''
          placeholder='Enter your email'
          type='text'
          onChange={(val) => handleInputChange('email', val)}
          isValid={isEmailValid}
          errorMessage='Email is invalid'
        />

        <TextInput
          ariaLabel='password text field'
          testId='login-password-text-input'
          initialValue=''
          placeholder='Enter your password'
          type='password'
          onChange={(val) => handleInputChange('password', val)}
          isValid={isPasswordValid}
          errorMessage='Password does not meet requirements'
        />

        <Button
          ariaLabel='login button'
          testId='login-button'
          value='Login'
          onClick={submitLoginForm}
        />

        <Button 
          ariaLabel='create account button'
          testId='create-account-button'
          value='Create account'
          onClick={navigateToCreateAccountPage}
        />
      </div>
    </Fragment>
  );
};

export default LoginPage;
