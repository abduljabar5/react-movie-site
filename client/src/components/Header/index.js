import React, { useContext, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import Auth from '../../utils/auth';
import {MyContext} from '../MyContext';
import Search from '../Search';
import IconHome from '../Icons/Home';
import Icon from '@mdi/react';
import IconMovieOpenPlayOutline from '../Icons/Movie';
import Shows from '../Icons/Shows'
import Naruto from '../../styles/images/anime.svg'
import pop from '../../styles/images/pop.png'
import { mdiAccount } from '@mdi/js';
import { useLocation } from 'react-router-dom';
const Header = () => {
  const { myState } = useContext(MyContext);
  const [navbar, setNavbar] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const {pathname} = useLocation()
  console.log(myState);
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  const changeBackground = () => {
    if (window.scrollY >= 180) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  }
  const handleOffcanvasClose = () => setShowOffcanvas(false);
  useEffect(() => {
    window.addEventListener('scroll', changeBackground);
    return () => {
      window.removeEventListener('scroll', changeBackground);
    };
  }, []);
  return (
    // <header className="bg-primary text-light mb-4 py-3 flex-row align-center">
    //   <div className="container flex-row justify-space-between-lg justify-center align-center">
    //     <div>
    //       <Link className="text-light" to="/">
    //         <h1 className="m-0">Tech Thoughts</h1>
    //       </Link>
    //       <p className="m-0">Get into the mind of a programmer.</p>
    //     </div>
       
    //   </div>
    // </header>
    <>
    
    <Navbar key='lg' expand='lg' className={navbar ? 'fixed-top' : ''} style={{backgroundColor:'#008080'}}>
        <Container fluid>
          <Navbar.Brand className='brand me-auto' href="/" style={{ fontSize:'30px'}}>
            <img src={pop} style={{width: '100px', height:'57px', backgroundColor:'transparent'}}></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-$'lg'`} onClick={() => setShowOffcanvas(true)}  />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-$'lg'`}
            aria-labelledby={`offcanvasNavbarLabel-expand-$'lg'`}
            placement="end"
            show={showOffcanvas}
            onHide={handleOffcanvasClose}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-$'lg'`}>
                Offcanvas
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className='mx-auto' style={{padding:'0'}}>
              <Nav className="flex-grow-1 ">
                <Link className={`nav-link ${pathname === '/' ? ' px-2 rounded-3 bg-secondary' : 'px-2'}`} to="/" onClick={handleOffcanvasClose}><IconHome /> Home</Link>
                <Link className={`nav-link ${pathname === '/movies' ? ' px-2 rounded-3 bg-secondary' : 'px-2'}`} to="/movies" onClick={handleOffcanvasClose}><IconMovieOpenPlayOutline /> Movies</Link>
                <Link className={`nav-link ${pathname === '/TV-Shows' ? ' px-2 rounded-3 bg-secondary' : 'px-2'}`} to="/TV-Shows" onClick={handleOffcanvasClose}><Shows /> Shows</Link>
                <Link className={`nav-link ${pathname === '/animepage' ? ' px-2 rounded-3 bg-secondary' : 'px-2'}`} to="/animepage" onClick={handleOffcanvasClose}>
                  <img className='naruto' src={Naruto}></img>
                   Anime</Link>
                {/* <NavDropdown
                  title="Dropdown"
                  id={`offcanvasNavbarDropdown-expand-$'lg'`}
                >
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown> */}
                <Search />
                {Auth.loggedIn() ? (
            <>
              <Link className="nav-link mx-auto" to="/me"><Icon 
  path={mdiAccount}
  title="User Profile"
  size={1}
  // className="shake-animation"
/>

      {Auth.getProfile().data.username}'s profile <Badge className={`${myState > 0 ? 'shake-animation' : ''}`} bg="secondary">{myState}</Badge>

    </Link>
              
              <button className="btn btn-outline-dark" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={`nav-link ${pathname === '/login' ? ' px-2 rounded-3 bg-secondary' : 'px-2'}`} onClick={handleOffcanvasClose} to="/login">
                Login
              </Link>
              <Link className={`nav-link ${pathname === '/logout' ? ' px-2 rounded-3 bg-secondary' : 'px-2'}`} onClick={handleOffcanvasClose} to="/signup">
                Signup
              </Link>
            </>
          )}
          
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      {navbar && <div style={{ height: "56px" }}></div>}
      </>

  );
};

export default Header;
