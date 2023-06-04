import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Notification from '../components/Notification/Alerts';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import 'animate.css';
import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);
  const [notification, setNotification] = useState(null);  // initialize state variable
  const [confirmPassword, setConfirmPassword] = useState(''); // Step 1
  const [shakeButton, setShakeButton] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if(formState.password !== confirmPassword) {
      setNotification({
        message: "Passwords do not match.",
        variant: "danger",
        key: Date.now(),
      });
      setShakeButton(true);
      setTimeout(() => setShakeButton(false), 1000); // Stop shaking after 1 second
      return;
    }
    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
      setNotification({
        message: e.message,
        variant: "danger",
        key: Date.now(),
      });
    }
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
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
            {/* The image half */}
            <div className="col-md-6 d-none d-md-flex bg-image"></div>
  
            {/* The content half */}
            <div className="col-md-6 bg-light">
              <div className="login d-flex align-items-center py-5">
                {/* Demo content */}
                <div className="container">
                  <div className="row">
                    <div className="col-lg-10 col-xl-7 mx-auto">
                      <h3 className="display-4 text-center">Signup!</h3>
                      {data ? (
                <p>
                  Success! You may now head{' '}
                  <Link to="/">back to the homepage.</Link>
                </p>
              ) : (
                      <form onSubmit={handleFormSubmit}>
                        <div className="form-group mb-3">
                        <input
                  className="form-control rounded-pill border-0 shadow-sm px-4"
                  placeholder="Username"
                  name="username"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                />
                        </div>
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
                        <div className="form-group mb-3">
          <input
            className="form-control rounded-pill border-0 shadow-sm px-4 text-primary"
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange} // Step 2
          />
        </div>
                        <button type="submit" className={`btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm ${shakeButton ? 'animate__animated animate__shakeX' : ''}`}>Sign up</button>
                        <div className="text-center d-flex justify-content-between mt-4">
                          <p>Have an account? 
                            <Link to='/login' className="font-italic text-muted">
                            <u>Login</u></Link></p>
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

export default Signup;
