import React, { useContext, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import Auth from '../../utils/auth';
import {MyContext,MyProvider} from '../MyContext';
import Search from '../Search';
import IconHome from '../Icons/Home';
import IconMovieOpenPlayOutline from '../Icons/Movie';
import Shows from '../Icons/Shows'
import Naruto from '../../styles/images/anime.svg'
const Header = () => {
  const { myState } = useContext(MyContext);
  const [navbar, setNavbar] = useState(false);
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  const changeBackground = () => {
    if (window.scrollY >= 180) { // You can adjust this value as per your navbar height
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  }

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', changeBackground);
    // cleanup the listener on component unmount
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
          <Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-$'lg'`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-$'lg'`}
            aria-labelledby={`offcanvasNavbarLabel-expand-$'lg'`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-$'lg'`}>
                Offcanvas
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Link className='nav-link' to="/"><IconHome /> Home</Link>
                <Nav.Link href="/movies"><IconMovieOpenPlayOutline /> Movies</Nav.Link>
                <Nav.Link href="/TV-Shows"><Shows /> Shows</Nav.Link>
                <Nav.Link href="/animepage">
                  <img className='naruto' src={Naruto}></img>
                   Anime</Nav.Link>
                <NavDropdown
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
                </NavDropdown>
                <Search />
                {Auth.loggedIn() ? (
            <>
              <Link className="nav-link" to="/me">
      {Auth.getProfile().data.username}'s profile <Badge bg="secondary">{myState}</Badge>
    </Link>
              
              <button className="btn btn-outline-dark" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Login
              </Link>
              <Link className="nav-link" to="/signup">
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
