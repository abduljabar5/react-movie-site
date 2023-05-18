import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


import Movieapi from '../api/ShowDetail';
import imdb from '../api/Imdb';
import imdblogo from '../styles/images/imdblogo.svg'
const MoreDetails = () => {
    const location = useLocation();
        const [id, setMovieId] = useState([]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const identity = searchParams.get('id');
        setMovieId(identity);
      }, [location.search]);
    const [movies, setMovies] = useState([]);
    const [ytvideos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
console.log(id);
    const searchMovie = () => {
        Movieapi.searchMovies(id)
            .then((res) => {
                setMovies(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                // handle errors
            });
    };
    // gets videos
    const videos = () => {
        Movieapi.movieVideos(id)
            .then((res) => {
                setVideos(res.data.results);
            })
            .catch((err) => {
                // handle errors
            });
    }
    console.log(movies);
    useEffect(() => {
        searchMovie();
        videos();

    }, [id])
    const getRating = () => {
        console.log(movies.name);

        // imdb.imdbRating(movies.name)
        // .then((res) => {
        //             console.log(res.data.results);
        //   setRating(res.data.results[0]);
        //   setIsLoading(false);
        // })
        // .catch((err) => {
        //   // handle errors
        // });
    }
    const [hasFetchedRating, setHasFetchedRating] = useState(false);

    useEffect(() => {
        if (!isLoading && !hasFetchedRating) {
            getRating();
            setHasFetchedRating(true);
        }
    }, [isLoading, hasFetchedRating]);
    // animating rating
    console.log(ytvideos);
    const percentage = movies.vote_average;
    // Define the style
    const style = {
        position: 'relative',
        width: '100%',
        height: 'auto',
        minHeight: '35rem',
        padding: '15rem 0',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        backgroundSize: 'cover'
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <header className="masthead" style={{ ...style, backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 75%, #000 100%), url(https://image.tmdb.org/t/p/original/${movies.backdrop_path})` }}>
                        <div className="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
                            <div className="d-flex justify-content-center">
                                <div className="text-center">
                                    <div className='showdetail-sec-imgcontainer'>
                                        <img className='shadow smallimage mx-auto' src={`https://image.tmdb.org/t/p/original/${movies.poster_path}`} alt="Backdrop Image" />
                                        <div className='mx-auto'>
                                            <h1 className="text-white mx-auto mt-5 mb-5">{movies.name}</h1>
                                            <div className='w-25 ratingcontainer'>
                                                <img src={imdblogo}></img> 
                                                <div>
                                                    <CircularProgressbar value={percentage} maxValue={10} text={`${percentage}%`} />
                                                </div>
                                            </div>


                                            <h4 className='text-light'>overview:</h4>
                                            <p className='mx-auto'>{movies.overview}</p>
                                            <div class="anime__details__widget text-light">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 mx-auto">
                                                        <ul>
                                                            <li><span>Type:</span>Movie</li>
                                                            {/* <li><span>Studios:</span>{movies.networks[0].name}</li> */}
                                                            <li><span>Date aired:</span>{movies.release_date}</li>
                                                            <li><span>Status:</span>{movies.status}</li>
                                                            <li><span>Genre:</span>{movies.genres.map((genre) => { return <span className='tv-genre-headings'>{genre.name}, </span> })}</li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-lg-5 col-md-6">
                                                        <ul>
                                                            {/* <li><span>Last aired:</span>{movies.last_air_date}</li> */}
                                                            <li><span>Rating:</span>{movies.vote_average} / {movies.vote_count} times</li>
                                                            <li><span>Duration:</span>{movies.runtime} mins</li>
                                                            {/* <li><span>Seasons:</span>{movies.number_of_seasons} Seasons/ {movies.number_of_episodes} Episode</li> */}
                                                            {/* <li><span>Last episode:</span>{movies.last_episode_to_air.air_date}</li> */}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="anime__details__btn">
                                                <a href="#" className="follow-btn"><i class="fa fa-heart-o"></i> Report</a>
                                                <a href="#" className="follow-btn"><i class="fa fa-heart-o"></i> Follow</a>
                                                <a href="#" className="watch-btn"><span>Watch Now</span> <i className="bi bi-arrow-bar-right"></i></a>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <section class="about-section text-center" id="about">
                        <div>
                            <div class="row gx-4 gx-lg-5 m-0 justify-content-center">
                                <div class="col-lg-8">
                                    <div className='videocontainer'>
                                        {ytvideos.map((video) => (
                                            <div key={video.id}>
                                                <h2>{video.name}</h2>
                                                {video.key && (
                                                    <iframe
                                                        width="960"
                                                        height="555"
                                                        src={`https://www.youtube.com/embed/${video.key}`}
                                                        title={video.name}
                                                        frameBorder="0"
                                                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                )}
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                          </div>
                    </section>

                </div>
            )}
        </div>
    );
};

export default MoreDetails;
