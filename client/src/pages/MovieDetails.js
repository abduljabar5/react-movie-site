import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useMutation, useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { useParams } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { openDB } from 'idb';

import Movieapi from '../api/ShowDetail';
import { ADD_MOVIE } from '../utils/mutations';
import imdb from '../api/Imdb';
import imdblogo from '../styles/images/imdblogo.svg'

// create and open the database
const setupDB = async () => {
  return openDB('MyDBMovies', 1, {
      upgrade(db) {
          db.createObjectStore('tmdbmovies');
      },
  });
};

const MoreDetails = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [heartFilled, setHeartFilled] = useState(null);
  const [savedMovies, setSavedMovies] = useState({});
  const [addMovie, { error }] = useMutation(ADD_MOVIE);
  const { username: userParam } = useParams();
console.log("id:",id);
  const { loading, data, err } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
      variables: { username: userParam },
  });

  useEffect(() => {
      if (!loading) {
          const user = data?.me || data?.user || {};
          console.log(user);
          const isMovieSaved = user.movies ? user.movies.some(savedMovie => savedMovie.tmdbId === id) : false;
          setHeartFilled(isMovieSaved)
          setSavedMovies({ ...savedMovies, [id]: isMovieSaved });
      }
  }, [loading, data, id]);

  useEffect(() => {
      const fetchData = async () => {
          const db = await setupDB();

          const cache = await db.get('tmdbmovies', id);
          if (!cache || Date.now() - cache.timestamp > 86400000) {
            console.log('fetcjingnew');
              try {
                  const themoviedbRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
                  const imdbRes = await axios.get(`https://imdb-api.com/en/API/Title/k_mmsg1u7d/${themoviedbRes.data.imdb_id}/Trailer,WikipediaFullActor,FullCast`);

                  const movieRes = await Movieapi.searchMovies(id);
                  const videoRes = await Movieapi.movieVideos(id);

                  const newMovie = {
                      id,
                      themoviedb: themoviedbRes.data,
                      imdb: imdbRes.data,
                      movie: movieRes.data,
                      videos: videoRes.data.results,
                      timestamp: Date.now(),
                  };

                  await db.put('tmdbmovies', newMovie, id);
                  setMovie(newMovie);
                } catch (error) {
                  console.error('Error fetching data', error);
                }
          } else {
              setMovie(cache);
          }

          setIsLoading(false);
      };

      fetchData();
  }, [id]);
  useEffect(() => {
    console.log('movie:', movie);
}, [movie]);

// console.log("movie:",movie);
  const handleSaveMovie = async () => {
      if (heartFilled) {
          console.log('This movie is already saved');
          return;
      }

      try {
        if (Auth.loggedIn()) {
            const userId = Auth.getProfile().data._id;
            const { themoviedb } = movie;
            const movieData = {
                tmdbId: String(themoviedb.id),
                imdbId: String(themoviedb.imdb_id),
            };

            const { data } = await addMovie({
                variables: { userId, movie: movieData },
            });
            const newHeartFilledState = !heartFilled;
            setHeartFilled(newHeartFilledState);

            const updatedSavedMovies = { ...savedMovies, [id]: newHeartFilledState };
            setSavedMovies(updatedSavedMovies);
            console.log('saved');
        } else {
            console.log('User is not logged in');
        }
    } catch (err) {
        console.error(err);
    }
};
  if (isLoading) {
      return <div>Loading...</div>;
  }

  const percentage = movie.movie.vote_average;
  // remaining part of your code...
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
                    <header className="" style={{ ...style, backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 75%, #000 100%), url(https://image.tmdb.org/t/p/original/${movie.movie.backdrop_path})` }}>
                        <div className="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
                            <div className="d-flex justify-content-center">
                                <div className="text-center">
                                    <div className='showdetail-sec-imgcontainer'>
                                        <img className='smallimage mx-auto' src={`https://image.tmdb.org/t/p/original/${movie.movie.backdrop_path}`} alt="Backdrop Image" />
                                        <div className='mx-auto'>
                                            <h1 className="text-white mx-auto mt-5 mb-5">{movie.imdb.fullTitle}</h1>
                                            <div className='w-25 ratingcontainer'>
                                                <img src={imdblogo}></img> 
                                                <div>
                                                    <CircularProgressbar value={percentage} maxValue={10} text={`${percentage}%`} />
                                                </div>
                                            </div>


                                            <h4 className='text-light'>overview:</h4>
                                            <p className='mx-auto'>{movie.movie.overview}</p>
                                            <div class="anime__details__widget text-light">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 mx-auto">
                                                        <ul>
                                                            <li><span>Type:</span>Movie</li>
                                                            {/* <li><span>Studios:</span>{movies.networks[0].name}</li> */}
                                                            <li><span>Date aired:</span>{movie.movie.release_date}</li>
                                                            <li><span>Status:</span>{movie.movie.status}</li>
                                                            <li><span>Genre:</span>{movie.movie.genres.map((genre) => { return <span className='tv-genre-headings'>{genre.name}, </span> })}</li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-lg-5 col-md-6">
                                                        <ul>
                                                            {/* <li><span>Last aired:</span>{movies.last_air_date}</li> */}
                                                            <li><span>Rating:</span>{movie.movie.vote_average} / {movie.movie.vote_count} times</li>
                                                            <li><span>Duration:</span>{movie.movie.runtime} mins</li>
                                                            {/* <li><span>Seasons:</span>{movies.number_of_seasons} Seasons/ {movies.number_of_episodes} Episode</li> */}
                                                            {/* <li><span>Last episode:</span>{movies.last_episode_to_air.air_date}</li> */}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="anime__details__btn">
    <a href="#" className="follow-btn" onClick={handleSaveMovie}>
        {heartFilled ? <i class="fa fa-heart"></i> : <i class="fa fa-heart-o"></i>} save
    </a>
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
                                        {movie.videos.map((video) => (
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
