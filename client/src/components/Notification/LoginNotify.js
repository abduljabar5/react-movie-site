// import { useState, useEffect } from 'react';
// import Toast from 'react-bootstrap/Toast';
// import Auth from '../../utils/auth';
// import { ToastContainer } from 'react-bootstrap';
// function BasicExample() {
//     const [timeElapsed, setTimeElapsed] = useState(0);
//     const [userLoggedIn, setUserLoggedIn] = useState(Auth.loggedIn());
//     const [show, setShow] = useState(false);
//     const username = userLoggedIn ? Auth.getProfile().data.username : null;

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setTimeElapsed(timeElapsed => timeElapsed + 1);
//         }, 60000); // update every minute

//         const toastTimer = setTimeout(() => {
//             setShow(true);
//         }, 10000); // show toast after 10 seconds

//         return () => {
//             clearInterval(timer); 
//             clearTimeout(toastTimer);
//         }
//     }, []);

//     useEffect(() => {
//         setUserLoggedIn(Auth.loggedIn());
//     }, []);

//     return (
//         <ToastContainer position='top-end'style={{position:'fixed', margin:'50px',zIndex:'2'}}>
//         <Toast  onClose={() => setShow(false)} show={show} delay={10000} autohide>
//             <Toast.Header closeButton={true}>
//                 <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
//                 <strong className="me-auto">Bootstrap</strong>
//                 <small>{timeElapsed} mins ago</small>
//             </Toast.Header>
//             <Toast.Body className='text-dark'>
//                 {userLoggedIn 
//                     ? `Hello, ${username}! Welcome back!` 
//                     : 'Hello, world! Please login or sign up to enjoy our services.'}
//             </Toast.Body>
//         </Toast>
//         </ToastContainer> 
//     );
// }

// export default BasicExample;
