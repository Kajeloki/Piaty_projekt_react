import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../context/auth-context';
import Input from '../UI/Input/Input';
const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false }
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: '', isValid: false }
};

const Login = (props) => {
  const ctx= useContext(AuthContext);
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: undefined });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, { value: '', isValid: undefined });

  const { isValid: emailStateIsValid } = emailState;
  const { isValid: passwordStateIsValid } = passwordState;

  const emailInputRef=useRef();
  const passwordInputRef=useRef();

  useEffect(() => {

    const identifier = setTimeout(() => {
      console.log('sprawdzanie poprawności formularza');
      setFormIsValid(
        emailStateIsValid && passwordStateIsValid
      );
    }, 500);

    return () => {
      console.log('czyszczenie');
      clearTimeout(identifier);
    };
  }, [emailStateIsValid, passwordStateIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value })

    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });
    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // );
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.isValid);
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid)
    {
      ctx.onLogin(emailState.value, passwordState.value);
    }
    else if(!emailStateIsValid)
    {
      emailInputRef.current.focus();
    }
    else
    {
      passwordInputRef.current.focus();
    }
    
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
       <Input id='email' label='E-Mail' type='email' isValid={emailStateIsValid} value={emailState.value} onChange={emailChangeHandler} onBlur={validateEmailHandler} ref={emailInputRef}/>
       <Input id='password' label='Password' type='password' isValid={passwordStateIsValid} value={passwordState.value} onChange={passwordChangeHandler} onBlur={validatePasswordHandler} ref={passwordInputRef}/>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
