import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useMutation, useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { useParams } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { openDB } from 'idb';
import { MyContext, MyProvider } from '../components/MyContext';
import { Card, Carousel } from 'react-bootstrap';
import Movieapi from '../api/ShowDetail';
import { ADD_MOVIE } from '../utils/mutations';
import Notification from '../components/Notification/Alerts';
import imdblogo from '../styles/images/imdblogo.svg'
import CarouselCards from '../components/Similar';
import ButtonSlideOut from '../components/WatchNow';
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
    const { incrementMyState } = useContext(MyContext);
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [heartFilled, setHeartFilled] = useState(null);
    const [savedMovies, setSavedMovies] = useState({});
    const [addMovie, { error }] = useMutation(ADD_MOVIE);
    const [notification, setNotification] = useState(null);

    const { username: userParam } = useParams();
    const { loading, data, err } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam },
    });

    useEffect(() => {
        if (!loading) {
            const user = data?.me || data?.user || {};
            const isMovieSaved = user.movies ? user.movies.some(savedMovie => savedMovie.tmdbId === id) : false;
            setHeartFilled(isMovieSaved)
            setSavedMovies({ ...savedMovies, [id]: isMovieSaved });
        }
    }, [loading, data, id]);

    useEffect(() => {
        setIsLoading(true);

        const fetchData = async () => {
            const db = await setupDB();

            const cache = await db.get('tmdbmovies', id);
            if (!cache || Date.now() - cache.timestamp > 86400000) {
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
    const handleSaveMovie = async () => {
        if (heartFilled) {
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
                incrementMyState();
                setNotification({
                    message: "Go to profile to view saved content",
                    variant: "success",
                    key: Date.now()
                });
            } else {
                console.log('User is not logged in');
                setNotification({
                    message: "Login Or Sigh Up",
                    key: Date.now()
                });
            }
        } catch (err) {
            console.error(err);
        }
    };
    if (isLoading) {
        return <div>Loading...</div>;
    }

    const percentage = movie.movie.vote_average;
    const style = {
        position: 'relative',
        width: '100%',
        height: 'auto',
        minHeight: '35rem',
        padding: '5rem 0',
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
                    <div>
                        {notification && (
                            <Notification
                                message={notification.message}
                                variant={notification.variant}
                                key={notification.key}
                            />
                        )}
                    </div>
                    <header className="" style={{ ...style, backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 75%, #000 100%), url(https://image.tmdb.org/t/p/original/${movie.movie.backdrop_path})` }}>
                        <div className="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
                            <div className="d-flex justify-content-center">
                                <div className="text-center">
                                    <div className='moviedetail-sec-imgcontainer movie-detail-page' style={{ display: "flex" }}>
                                        <div>
                                            <img className=' smallimage mx-auto' src={`https://image.tmdb.org/t/p/original/${movie.movie.poster_path}`} alt="Backdrop Image" />

                                            <div style={{ display: 'flex', marginTop: '20px' }}>
                                                <img src={`https://image.tmdb.org/t/p/original/${movie.movie.production_companies[0].logo_path}`} style={{ width: '70px' }}></img>
                                                <a
                                                    type='button'
                                                    href={movie.movie.homepage}
                                                    className='btn btn-outline-danger w-100 ms-4'
                                                    target='_blank'
                                                    rel='noreferrer'
                                                >
                                                    Watch Now
                                                </a>
                                            </div>
                                        </div>
                                        <div className='mx-auto'>
                                            <h1 className="text-white mx-auto mt-5 mb-5">{movie.imdb.fullTitle}</h1>
                                            <div className='w-25 ratingcontainer m-4 g-2'>
                                                <img src={imdblogo}></img>
                                                <h5 style={{ alignSelf: 'center', margin: '10px', fontSize: '30px' }}>{movie.imdb.imDbRating}</h5>
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
                                                            <li><span>Contry:</span>{movie.imdb.countries}</li>
                                                            <li><span>Date aired:</span>{movie.imdb.releaseDate}</li>
                                                            <li><span>Status:</span>{movie.movie.status}</li>
                                                            <li><span>Genre:</span>{movie.movie.genres.map((genre) => { return <span className='tv-genre-headings'>{genre.name}, </span> })}</li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-lg-5 col-md-6">
                                                        <ul>
                                                            <li><span>Content Rating:</span>{movie.imdb.contentRating}</li>
                                                            <li><span>TMDB Rating:</span>{movie.movie.vote_average}</li>
                                                            <li><span>Duration:</span>{movie.imdb.runtimeStr}</li>
                                                            <li><span>Budget:</span>{movie.imdb.boxOffice.budget ? (movie.imdb.boxOffice.budget) : ('Unknown')}</li>
                                                            <li><span>Companies:</span>{movie.imdb.companies}</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="anime__details__btn" style={{ display: 'flex', justifyContent: 'center' }}>
                                                <a style={{ textDecoration: "none", cursor: 'pointer' }} className="follow-btn" onClick={handleSaveMovie}>
                                                    {heartFilled ? <i class="fa fa-heart animate__animated animate__heartBeat"></i> : <i class="fa fa-heart-o"></i>} save
                                                </a>
                                                <ButtonSlideOut prompt={movie.imdb} />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mx-auto' style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                             <h1 className='title'>Cast:</h1>
                            <div style={{ display: 'flex' }}>
                               
                                <div class="cast-container mx-auto" style={{ width: "87vw" }}>
                                    {movie.imdb.actorList.map((item, index) => (
                                        <div class="cast-item">
                                            <div className=" border-0" key={index}>
                                            <a href={`https://www.google.com/search?q=${item.name}`} target='blank'>
                                                <div className=''>
                                                    {/* <Link to={`/movie?id=${item.id}`}> */}
                                                    <Card.Img
                                                        className='cardimage'
                                                        style={{ minHeight: '250px', maxHeight: '250px', backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: '15px' }}
                                                    />
                                                    <Card.ImgOverlay className='imageoverlay'>
                                                        <Card.Title>{item.title}</Card.Title>
                                                        <Card.Text>{item.imDbRating}</Card.Text>
                                                    </Card.ImgOverlay>
                                                    {/* </Link> */}
                                                </div>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div></div>
                            {/* <div className="d-flex flex-column mx-auto m-auto gap-4">
                                                    <Button variant="outline-primary" size="lg">
                                                        Save
                                                    </Button>
                                                    <Button variant="danger" size="lg">
                                                        Watch Trailer
                                                    </Button>
                                                    <Button variant="primary" size="lg">
                                                        Watch Now
                                                    </Button>

                                                </div> */}
                        </div>
                    </header>
                    <section id='trailers'>
                        <h1 className='title my-4'>Trailers</h1>
                        <Carousel className='carousel-btn'>
                            {movie.videos.slice(0,10).map((video) =>
                                <Carousel.Item interval={16000}>
                                    <div key={video.id} className='video-center'>
                                        {video.key && (
                                            <iframe
                                                className='flex'
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
                                    <Carousel.Caption>
                                        <h3>{video.name}</h3>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            )}
                        </Carousel>
                    </section>
                    <CarouselCards additionalData={movie.imdb} />
                </div>
            )}
        </div>
    );
};

export default MoreDetails;
