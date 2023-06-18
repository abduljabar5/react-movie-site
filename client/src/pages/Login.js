import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import IconAppletv from '../components/Icons/Home';
import Notification from '../components/Notification/Alerts';

import Auth from '../utils/auth';

const Login = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);
  const [notification, setNotification] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (savedEmail && savedPassword && rememberMe) {
      setFormState({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);
  
const handleFormSubmit = async (event) => {
  event.preventDefault();
  try {
    const { data } = await login({
      variables: { ...formState },
    });

    Auth.login(data.login.token);

    if (rememberMe) {
      localStorage.setItem('email', formState.email);
      localStorage.setItem('password', formState.password); 
      localStorage.setItem('rememberMe', 'true'); 
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password'); 
      localStorage.removeItem('rememberMe'); 
    }
  } catch (e) {
    console.error(e);
    setNotification({
      message: e.message,
      variant: "danger",
      key: Date.now(),
    });
  }

  setFormState({
    email: '',
    password: '',
  });
};

useEffect(() => {
  const savedEmail = localStorage.getItem('email');
  const savedPassword = localStorage.getItem('password');
  if (savedEmail && savedPassword) {
    setFormState(prevState => ({
      ...prevState,
      email: savedEmail,
      password: savedPassword
    }));
  }
}, []);

const handleRememberMeChange = (event) => {
  setRememberMe(event.target.checked);
}

  return (
    <main className="flex-row justify-center mb-4">
       {notification && (
                            <Notification
                                message={notification.message}
                                variant={notification.variant}
                                key={notification.key}
                            />
                        )}
      <div className="container-fluid">
        <div className="row no-gutter">
          <div className="col-md-6 d-none d-md-flex bg-image"></div>
          <div className="col-md-6 bg-light">
            <div className="login d-flex align-items-center py-5">
              <div className="container">
                <div className="row">
                  <div className="col-lg-10 col-xl-7 mx-auto">
                    <h3 className="display-4 text-center">Login!</h3>
                    {data ? (
              <p>
                Success! You may now head{' '}
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
                    <form onSubmit={handleFormSubmit}>
                      <div className="form-group mb-3">
                        <input id="inputEmail" type="email" placeholder="Email address" required autoFocus className="form-control rounded-pill border-0 shadow-sm px-4" name="email"
                          value={formState.email}
                          onChange={handleChange} />
                      </div>
                      <div className="form-group mb-3">
                        <input
                          className="form-control rounded-pill border-0 shadow-sm px-4 text-primary"
                          placeholder="******"
                          name="password"
                          type="password"
                          value={formState.password}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="custom-control custom-checkbox mb-3">
                      <input 
          id="customCheck1" 
          type="checkbox" 
          className="custom-control-input"
          checked={rememberMe} 
          onChange={handleRememberMeChange}
        />
                        <label htmlFor="customCheck1" className="custom-control-label">Remember password</label>
                      </div>
                      <button type="submit" className="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm">Log in</button>
                      <div className="text-center d-flex justify-content-between mt-4">
                        <p>Don't have an account? 
                          <Link to='/signup' className="font-italic text-muted">
                          <u>Sign Up</u></Link></p>
                      </div>
                    </form>
                     )} 
                     
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
