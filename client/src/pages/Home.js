import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';
import helper from '../styles/images/helper.svg'
import video from '../styles/images/trailer1.mp4';
import API from '../api/Trending';
import TrendingAnime from '../components/TrendingAnime';
import MovieNews from '../components/Movie-tv-news';

const Movies = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showchat, setShowChat] = useState(false);

    const { username: userParam } = useParams();

    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
      variables: { username: userParam },
    });

    const user = data?.me || data?.user || {};

    useEffect(() => {
      
      if (Auth.loggedIn()){
        setShowChat(true);
      } else {
        console.log('login');
      }

    }, []);

    const [shows, setShow] = useState([]);
    const [movies, setMovies] = useState([]);
    const [nowplaying, seNowplaying] = useState([]);
    const [trendingToday, setTrendingToday] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const Today = await API.trendingToday();
            setTrendingToday(Today.data.results);

            const showResults = await API.search();
            setShow(showResults.data.results);

            const movieResults = await API.trendingMovies();
            setMovies(movieResults.data.results);

            const nowPlayingResults = await API.inTheaters();
            seNowplaying(nowPlayingResults.data.results);

            setIsLoading(false);
            console.log('today',Today.data.results);
            console.log(showResults.data.results);
            console.log(movieResults.data.results);
            console.log(nowPlayingResults.data.results);
        };

        fetchData();
    }, []);

    // Rest of the code


    const style = {
        position: 'relative',
        width: '100%',
        height: 'auto',
        minHeight: '35rem',
        padding: '15rem 0',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        backgroundSize: 'cover'
    };

    return (
        <main>
             {isLoading ? (
               <div class="progress" role="progressbar" aria-label="Example 1px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"  style={{height: "20px"}}>
               <div class="progress-bar progress-bar-striped" style={{width: "85%"}}></div>
             </div>
            ) : (
                <div>
         <div>
  <div id="carouselExampleAutoplaying" class="carousel slide carousel-fade" data-bs-ride="carousel">
    <div class="carousel-inner">
      {trendingToday.map((today, index) => {
        return (
          <div  class={`carousel-item${index === 0 ? " active" : ""}`}>
            <header
              className=""
              style={{
                ...style,
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 75%, #000 100%), url(https://image.tmdb.org/t/p/original/${today.backdrop_path})`,
              }}
            >
              <div class="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
                <div class="d-flex justify-content-center">
                  <div class="text-center">
                    {/* <h1 class="mx-auto my-0 text-uppercase">Black Taxi</h1>  */}
                    <h1 class="text-white mt-2 mb-5">
                     {today.title}
                    </h1>
                    <div class="mainbtn">
                      <a class="btn btn-primary" href="tel:(612) 991-4250">
                        Call Now
                      </a>
                      <a class="btn btn-primary" href="form.html">
                        Book Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          </div>
        );
      })}
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleAutoplaying"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleAutoplaying"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</div>

                  
<div className='all-container'>
<div className='movie-tv-container'>
            <div className="product spad">

                <div className="">

                    <div className="trending__product">
                        <div className="row">
                            <div className="row">
                                <div className="div-title">
                                    <h4>Trending Now</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="btn__all">
                                    <a href="#" className="primary-btn">View All <span className="arrow_right"></span></a>
                                </div>
                            </div>
                        </div>
                        <div className='boobo'>
                            {shows.map((show) => {
                                if (show.origin_country[0] === "US" || "JP") {
                                    // console.log(JSON.stringify(show.name));
                                    const id = show.id
                                    return (

                                        <div className="product__item mx-auto">
                                            <Link to={`/details?id=${id}`}>
                                                <div className="product__item__pic set-bg" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w400/${show.poster_path})` }}>
                                                    <div className="ep">18 / 18</div>
                                                    <div className="comment"><i className="fa fa-comments"></i> 11</div>
                                                    <div className="view"><i className="fa fa-eye"></i> {show.vote_average}</div>
                                                </div></Link>
                                            <div className="product__item__text">
                                                <ul>
                                                    <li className='text-dark'><h4>{show.name}</h4></li>
                                                    <li className='text-danger'><cite>{show.first_air_date}</cite></li>
                                                </ul>
                                            </div>
                                        </div>
                                    )
                                }
                            })}

                        </div>
                    </div>
                </div>
            </div>
            <div className="product spad">

                <div className="">

                    <div className="trending__product">
                        <div className="row">
                            <div className="row">
                                <div className="div-title">
                                    <h4>Trending Now</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="btn__all">
                                    <a href="#" className="primary-btn">View All <span className="arrow_right"></span></a>
                                </div>
                            </div>
                        </div>
                        <div className='boobo'>
                            {movies.map((show) => {
                                // if (show.origin_country[0] === "US" ||"JP") {
                                // console.log(JSON.stringify(show.name));
                                const id = show.id
                                return (

                                    <div className="product__item mx-auto">
                                        <Link to={`/moviedetails?id=${id}`}>
                                            <div className="product__item__pic set-bg" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w400/${show.poster_path})` }}>
                                                <div className="ep">18 / 18</div>
                                                <div className="comment"><i className="fa fa-comments"></i> 11</div>
                                                <div className="view"><i className="fa fa-eye"></i> {show.vote_average}</div>
                                            </div></Link>
                                        <div className="product__item__text">
                                            <ul>
                                                <li className='text-dark'><h4>{show.name}</h4></li>
                                                <li className='text-danger'><cite>{show.first_air_date}</cite></li>
                                            </ul>
                                        </div>
                                    </div>
                                )
                                // }
                            })}

                        </div>
                    </div>
                </div>
                 
            </div>
            <div className="product spad">

                <div className="">

                    <div className="trending__product">
                        <div className="row">
                            <div className="row">
                                <div className="div-title">
                                    <h4>In Theaters</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="btn__all">
                                    <a href="#" className="primary-btn">View All <span className="arrow_right"></span></a>
                                </div>
                            </div>
                        </div>
                        <div className='boobo'>
                            {nowplaying.map((playing) => {
                                // if (show.origin_country[0] === "US" ||"JP") {
                                // console.log(JSON.stringify(show.name));
                                const id = playing.id
                                return (

                                    <div className="product__item mx-auto">
                                        <Link to={`/moviedetails?id=${id}`}>
                                            <div className="product__item__pic set-bg" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w400/${playing.poster_path})` }}>
                                                <div className="ep">18 / 18</div>
                                                <div className="comment"><i className="fa fa-comments"></i> 11</div>
                                                <div className="view"><i className="fa fa-eye"></i> {playing.vote_average}</div>
                                            </div></Link>
                                        <div className="product__item__text">
                                            <ul>
                                                <li className='text-dark'><h4>{playing.name}</h4></li>
                                                <li className='text-danger'><cite>{playing.first_air_date}</cite></li>
                                            </ul>
                                        </div>
                                    </div>
                                )
                                // }
                            })}

                        </div>
                    </div>
                </div>
                 
            </div>
            </div>
            <div style={{width: '100%'}}>
                 <TrendingAnime />
            <MovieNews />
            </div>
           
            </div>
            
            </div>
            )}
          
        </main>
    );
};

export default Movies;

