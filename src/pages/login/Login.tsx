import { Button, TextInput } from '../../components';
import { Fragment, useState } from 'react';
import { login } from './service/login-service';
import { useNavigate } from 'react-router-dom';

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

  const submitLoginForm = () => {
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
        
  const handleInputChange = (name: string, val: string) => {
    setData({...data, [name]: val});
  };

  return (
    <Fragment>
      <TextInput
        initialValue=''
        placeholder='email'
        type='text'
        onChange={(val) => handleInputChange('email', val)}
      />

      <br/>

      <TextInput
        initialValue=''
        placeholder='password'
        type='password'
        onChange={(val) => handleInputChange('password', val)}
      />

      <br/>

      <Button 
        value='Login'
        onClick={() => submitLoginForm()}
      />
    </Fragment>
  );
};

export default LoginPage;
