import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faContactBook } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
<div>
  <footer className="text-center text-white">
    <div className="container">
      <section className="mt-5">
        <div className="row text-center d-flex justify-content-center pt-5">
          <div className="col-md-2">
            <h6 className="text-uppercase font-weight-bold">
              <Link to="/" className="text-white"><FontAwesomeIcon icon={faArrowCircleRight} /> Home</Link>
            </h6>
          </div>
          <div className="col-md-2">
            <h6 className="text-uppercase font-weight-bold">
              <Link to="/movies#" className="text-white"><FontAwesomeIcon icon={faArrowCircleRight} /> Movies</Link>
            </h6>
          </div>
          <div className="col-md-2">
            <h6 className="text-uppercase font-weight-bold">
              <Link to="/TV-Shows" className="text-white"><FontAwesomeIcon icon={faArrowCircleRight} /> TV-Series</Link>
            </h6>
          </div>
          <div className="col-md-2">
            <h6 className="text-uppercase font-weight-bold">
              <Link to="/animepage" className="text-white"><FontAwesomeIcon icon={faArrowCircleRight} /> Anime</Link>
            </h6>
          </div>
          <div className="col-md-2">
            <h6 className="text-uppercase font-weight-bold">
              <a href="https://abduljabar5.github.io/react-portfolio/#contact" className="text-white"><FontAwesomeIcon icon={faArrowCircleRight} /> Contact</a>
            </h6>
          </div>
        </div>
      </section>

      <hr className="my-5" />

      <section className="mb-5">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-8">
            <p>
              PopcornPeek is a comprehensive MERN stack web application offering real-time updates on trending movies, TV shows, anime, and entertainment news. It serves as a one-stop platform for entertainment enthusiasts seeking a personalized viewing experience.
            </p>
          </div>
        </div>
      </section>
      <section className="text-center mb-5">
      <a href="https://abduljabar5.github.io/react-portfolio/#contact" className="text-white me-4" target='blank'>
          <FontAwesomeIcon icon={faContactBook} />
        </a>
        <a href="mailto:abduljabar.jobs@gmail.com" className="text-white me-4" target='blank'>
          <FontAwesomeIcon icon={faGoogle} />
        </a>
        <a href="https://www.linkedin.com/in/abduljabar5/" className="text-white me-4" target='blank'>
          <FontAwesomeIcon icon={faLinkedinIn} />
        </a>
        <a href="https://github.com/abduljabar5/react-movie-site" className="text-white me-4" target='blank'>
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </section>
    </div>
    <div className="text-center p-3"> © 2023 Copyright:
      <a className="text-white">PopcornPeek</a>
    </div>
  </footer>
</div>

  )
};

export default Footer;
