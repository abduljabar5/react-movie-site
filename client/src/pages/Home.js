import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import video from '../styles/images/trailer1.mp4';
import API from '../api/Trending';


const Movies = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [shows, setShow] = useState([]);
    const searchShows = () => {
        API.search()
            .then((res) => {
                setShow(res.data.results);
            })
            .catch((err) => {
                // handle errors
            });
    };
    const [movies, setMovies] = useState([]);
    const trendingMoviesWeek = () => {
        API.trendingMovies()
            .then((res) => {
                setMovies(res.data.results);
                setIsLoading(false);
            })
            .catch((err) => {
                // handle errors
            });
    };
    const [nowplaying, seNowplaying] = useState([]);
    const newMovies = () => {
        API.inTheaters()
            .then((res) => {
                seNowplaying(res.data.results);

            })
            .catch((err) => {
                // handle errors
            });
    };
    useEffect(() => {
        searchShows();
        trendingMoviesWeek();
        newMovies();

    }, [])
    console.log(movies);
    console.log(shows);
    console.log(nowplaying);
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
                <p>Loading...</p>
            ) : (
                <ddiv>
                    <header className="masthead" style={{ ...style, backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 75%, #000 100%), url(https://image.tmdb.org/t/p/original/${movies[0].backdrop_path})` }}>
        <div class="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
            <div class="d-flex justify-content-center">
                <div class="text-center">
                     {/* <h1 class="mx-auto my-0 text-uppercase">Black Taxi</h1>  */}
                    <h1 class="text-white mx-auto mt-2 mb-5">Total Town Car Service and Taxi Msp</h1>
                    <div class="mainbtn"><a class="btn btn-primary" href="tel:(612) 991-4250">Call Now</a>
                        <a class="btn btn-primary" href="form.html">Book Now</a>
                    </div>

                </div>
            </div>
        </div>
    </header>


            <section className="product spad">

                <div className="">

                    <div className="trending__product">
                        <div className="row">
                            <div className="row">
                                <div className="section-title">
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
            </section>
            <section className="product spad">

                <div className="">

                    <div className="trending__product">
                        <div className="row">
                            <div className="row">
                                <div className="section-title">
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
            </section></ddiv>
            )}
        </main>
    );
};

export default Movies;

