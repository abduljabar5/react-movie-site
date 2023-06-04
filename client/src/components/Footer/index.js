import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
<div class="container my-5">
  <footer class="text-center text-white">
    <div class="container">
      <section class="mt-5">
      
        <div class="row text-center d-flex justify-content-center pt-5">
          <div class="col-md-2">
            <h6 class="text-uppercase font-weight-bold">
              <Link to="/" class="text-white">Home</Link>
            </h6>
          </div>
          <div class="col-md-2">
            <h6 class="text-uppercase font-weight-bold">
            <Link to="/movies#" class="text-white">Movies</Link>
            </h6>
          </div>
          <div class="col-md-2">
            <h6 class="text-uppercase font-weight-bold">
            <Link to="/TV-Shows" class="text-white">TV-Series</Link>
            </h6>
          </div>
          <div class="col-md-2">
            <h6 class="text-uppercase font-weight-bold">
            <Link to="/animepage" class="text-white">Anime</Link>
            </h6>
          </div>
          <div class="col-md-2">
            <h6 class="text-uppercase font-weight-bold">
              <a href="https://abduljabar5.github.io/react-portfolio/#contact" class="text-white">Contact</a>
            </h6>
          </div>
        </div>
      
      </section>

      <hr class="my-5" />

      
      <section class="mb-5">
        <div class="row d-flex justify-content-center">
          <div class="col-lg-8">
            <p>
            PopcornPeek is a comprehensive MERN stack web application offering real-time updates on trending movies, TV shows, anime, and entertainment news. It serves as a one-stop platform for entertainment enthusiasts seeking a personalized viewing experience.
            </p>
          </div>
        </div>
      </section>
      <section class="text-center mb-5">
        <a href="" class="text-white me-4">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="" class="text-white me-4">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="" class="text-white me-4">
          <i class="fab fa-google"></i>
        </a>
        <a href="" class="text-white me-4">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="" class="text-white me-4">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="" class="text-white me-4">
          <i class="fab fa-github"></i>
        </a>
      </section>
   
    </div>
 

    
    <div class="text-center p-3"> © 2023 Copyright:
      <a class="text-white">PopcornPeek</a>
    </div>
  </footer>
</div>

  )
};

export default Footer;
