import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const Notification = ({ message, variant }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    show && <Alert position='top-end' style={{position: 'fixed', zIndex: 2, right: '0px', top: '100px'}} variant={variant} dismissible>{message}</Alert>
    );
};

export default Notification;
